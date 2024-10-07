import ballerina/http;
import ballerina/uuid;
import ballerinax/mongodb;

configurable string host = "localhost";
configurable int port = 27017;
configurable string username = "username";
configurable string password = "password";
configurable string database = "Telemedicine";

// MongoDB client configuration with authentication
mongodb:Client mongoDb = check new ({
    connection: {
        serverAddress: {
            host: "localhost",
            port: 27017
        }
    }
});

function setCORSHeaders(http:Response res) returns http:Response {
    res.addHeader("Access-Control-Allow-Origin", "*");
    res.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, userId");
    return res;
}

function createErrorResponse(string message) returns http:Response|error {
    json errorResponse = {"status": "error", "message": message};
    http:Response response = new;
    response.setJsonPayload(errorResponse);
    check response.setContentType("application/json");
    response.statusCode = 500;
    return response;
}

function createSuccessResponse(string message) returns http:Response|error {
    json successResponse = {"status": "success", "message": message};
    http:Response response = new;
    response.setJsonPayload(successResponse);
    check response.setContentType("application/json");
    response.statusCode = 200;
    return response;
}

service /user on new http:Listener(8080) {

    private final mongodb:Database TelemedicineDb;

    function init() returns error? {
        self.TelemedicineDb = check mongoDb->getDatabase("Telemedicine");
    }

    resource function post register(UserInput input) returns http:Response|error {

        mongodb:Collection usersCollection = check self.TelemedicineDb->getCollection("users");

        // Check if user already exists
        User|mongodb:DatabaseError|mongodb:ApplicationError|error|() existingUser = usersCollection->findOne({
            username: input.username
        });
        if existingUser is User {
            http:Response errorRes = check createErrorResponse("User Already exists");
            return setCORSHeaders(errorRes);
        }

        // Create new user with specialization for doctors
        User newUser = {
            id: uuid:createType1AsString(),
            username: input.username,
            password: input.password, // Store hashed password in production
            role: input.role,
            specialization: input.role == "doctor" ? input.specialization : ""
        };

        check usersCollection->insertOne(newUser);
        http:Response res = check createSuccessResponse("Registration successful!");
        return setCORSHeaders(res);
    }

    // Fetch User Details
    resource function get details(string username) returns User|error {
        mongodb:Collection usersCollection = check self.TelemedicineDb->getCollection("users");
        User|mongodb:DatabaseError|mongodb:ApplicationError|error|() user = usersCollection->findOne({
            username: username
        });
        if user is User {
            return user;
        } else {
            return error("User not found.");
        }
    }

    // User Login
    resource function post login(LoginInput input) returns http:Response|error {
        mongodb:Collection usersCollection = check self.TelemedicineDb->getCollection("users");

        stream<User, error?> resultStream = check usersCollection->aggregate([
            {
                \$match: {
                    username: input.username,
                    password: input.password
                }
            }
        ]);

        var result = resultStream.next();

        if result is record {|User value;|} {
            string userId = result.value.id.toString();
            string role = result.value.role.toString();
            string username = result.value.username.toString();

            // Include the userId in the success response
            json responseBody = {
                "status": "success",
                "message": "Login successful!",
                "userId": userId, // Return userId to the client
                "role": role,
                "username": username
            };

            http:Response res = new;
            res.setJsonPayload(responseBody);
            return setCORSHeaders(res);
        } else {
            http:Response errorRes = check createErrorResponse("Invalid credentials.");
            return setCORSHeaders(errorRes);
        }
    }

    resource function post scheduleAppointment(AppointmentInput input, string patientId) returns http:Response|error {
        mongodb:Collection appointmentsCollection = check self.TelemedicineDb->getCollection("appointments");

        // Check if the doctor has any appointments scheduled at the same time
        Appointment|mongodb:DatabaseError|mongodb:ApplicationError|error|() existingAppointment = appointmentsCollection->findOne({
            "doctorId": input.doctorId,
            "appointmentTime": input.appointmentTime
        });

        if existingAppointment is Appointment {
            http:Response errorRes = check createErrorResponse("Doctor is not available at the selected time.");
            return setCORSHeaders(errorRes);
        }

        // Proceed with scheduling the appointment if the doctor is available
        Appointment appointment = {
            id: uuid:createType1AsString(),
            appointmentTime: input.appointmentTime,
            patientId: patientId,
            doctorId: input.doctorId,
            status: input.status,
            appointmentDate: input.appointmentDate
        };

        // Insert the new appointment into the appointments collection
        check appointmentsCollection->insertOne(appointment);

        // Create a successful response
        http:Response res = check createSuccessResponse("Appointment scheduled successfully.");
        return setCORSHeaders(res);
    }

    // Patient-Doctor Messaging
    resource function post sendMessage(MessageInput input) returns http:Response|error {
        mongodb:Collection messagesCollection = check self.TelemedicineDb->getCollection("messages");

        Message message = {
            id: uuid:createType1AsString(),
            senderId: input.senderId,
            recipientId: input.recipientId,
            content: input.content,
            timestamp: input.timestamp
        };

        check messagesCollection->insertOne(message);

        http:Response res = check createSuccessResponse("Message Sent successfully.");
        return setCORSHeaders(res);

    }

    // Patient Dashboard: View appointments
    resource function get patientDashboard(http:Request req) returns error|http:Response {
        mongodb:Collection appointmentsCollection = check self.TelemedicineDb->getCollection("appointments");

        // Extract userId from the request headers or body
        string patientId = check req.getHeader("userId"); // Assuming frontend sends userId in headers

        // Find all appointments for this patient
        stream<Appointment, error?> resultStream = check appointmentsCollection->find({patientId: patientId});
        json appointments = resultStream.toString();
        http:Response res = check createSuccessResponse(<string>appointments);
        return setCORSHeaders(res);
    }

    // Doctor Dashboard: View appointments
    resource function get doctorAppointments(http:Request req) returns error|http:Response {
        mongodb:Collection appointmentsCollection = check self.TelemedicineDb->getCollection("appointments");

        // Extract userId from the request headers
        string doctorId = check req.getHeader("userId"); // Assuming frontend sends userId in headers

        // Find all appointments for this doctor
        stream<Appointment, error?> resultStream = check appointmentsCollection->find({doctorId: doctorId});
        json appointments = resultStream.toString(); // Convert the stream to JSON
        http:Response res = check createSuccessResponse(<string>appointments);
        return setCORSHeaders(res);
    }

    //Patient Profile Implementation
    //search doctor
    resource function get searchDoctors(string specialization) returns json|error {
        // Get the collection
        mongodb:Collection usersCollection = check self.TelemedicineDb->getCollection("users");

        // Find doctors with the matching specialization
        stream<User, error?> resultStream = check usersCollection->find({role: "doctor", specialization: specialization});

        // Initialize an empty array to collect doctor details
        json[] doctorList = [];

        // Iterate over the resultStream and build the JSON array
        error? e = resultStream.forEach(function(User doctor) {
            json doctorJson = {
                "name": doctor.username,
                "specialization": doctor.specialization

            };
            doctorList.push(doctorJson); // Add each doctor to the list
        });

        // Return the list of doctors as a JSON array
        return doctorList;
    }

    //upload health record
    resource function post uploadHealthRecord(http:Request req, HealthRecordInput input) returns http:Response|error {
        mongodb:Collection healthRecordsCollection = check self.TelemedicineDb->getCollection("health_records");

        // Get the userId from the request body or headers
        string userId = check req.getHeader("userId"); // Assuming frontend sends userId in headers

        // Construct the health record object
        HealthRecordInput newRecord = {
            id: uuid:createType1AsString(),
            patientId: userId,
            recordUrl: input.recordUrl,
            timestamp: input.timestamp
        };

        // Insert the health record into the collection
        check healthRecordsCollection->insertOne(newRecord);

        return createSuccessResponse("Health record uploaded successfully.");
    }

    resource function get listDoctors() returns error|http:Response {
        // Get the collection
        mongodb:Collection usersCollection = check self.TelemedicineDb->getCollection("users");

        // Find all doctors without filtering by specialization
        stream<User, error?> resultStream = check usersCollection->find({role: "doctor"});

        // Initialize an empty array to collect doctor details
        json[] doctorList = [];

        // Iterate over the resultStream and build the JSON array
        error? e = resultStream.forEach(function(User doctor) {
            json doctorJson = {
                "id": doctor.id,
                "username": doctor.username,
                "specialization": doctor.specialization
            };
            doctorList.push(doctorJson); // Add each doctor to the list
        });

        // Return the list of doctors as a JSON array directly
        http:Response res = new;
        res.setJsonPayload(doctorList);
        return setCORSHeaders(res);
    }

    resource function options listDoctors() returns http:Response {
        http:Response res = new;
        http:Response cORSHeaders = setCORSHeaders(res);
        res.addHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.addHeader("Access-Control-Allow-Origin", "*");
        return res;
    }

    resource function options login() returns http:Response {
        http:Response res = new;
        http:Response cORSHeaders = setCORSHeaders(res);
        res.addHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        return res;
    }

    resource function options register() returns http:Response {
        http:Response res = new;
        http:Response cORSHeaders = setCORSHeaders(res);
        res.addHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        return res;
    }

    resource function options patientDashboard() returns http:Response {
        http:Response res = new;
        http:Response cORSHeaders = setCORSHeaders(res);
        res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.addHeader("Access-Control-Allow-Headers", "userId, Content-Type");

        return res;
    }

    resource function options scheduleAppointment() returns http:Response {
        http:Response res = new;
        http:Response cORSHeaders = setCORSHeaders(res);

        res.addHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

        return res;
    }

    resource function options sendMessage() returns http:Response {
        http:Response res = new;
        http:Response cORSHeaders = setCORSHeaders(res);
        res.addHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        return res;
    }

    resource function options searchDoctors() returns http:Response {
        http:Response res = new;
        http:Response cORSHeaders = setCORSHeaders(res);
        res.addHeader("Access-Control-Allow-Origin", "*");
        res.addHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

        return res;
    }

}

type PatientProfileInput record {
    string id;
    string username;
    string role; // "patient"
    string healthRecords; // e.g., file path or URL to uploaded health records
    // Add other necessary fields like age, gender, etc.
};

// Input Types
type UserInput record {
    string username;
    string password; // In production, hash this password
    string role; // "patient" or "doctor"
    string specialization;
};

type LoginInput record {
    string username;
    string password;
};

type AppointmentInput record {
    string patientId;
    string doctorId;
    string appointmentTime;
    string appointmentDate;
    string status; // e.g., "scheduled", "completed"
};

type MessageInput record {
    string senderId; // ID of the patient or doctor
    string recipientId; // ID of the other party
    string content;
    string timestamp;
};

type DoctorProfile record {
    string id;
    string username;
    string role; // "doctor"
    string specialization;
    // Add other necessary fields like qualifications, experience, etc.
};

// Data Types
type User record {
    string id;
    string username;
    string password; // Store hashed password in production
    string role; // "patient" or "doctor"
    string specialization;
};

type Appointment record {
    string id;
    string patientId;
    string doctorId;
    string appointmentTime;
    string status;
    string appointmentDate;

};

type HealthRecordInput record {
    string recordUrl; // URL to the uploaded health record file
    string timestamp; // The time the record was uploaded
    string id;
    string patientId;
};

type Message record {
    string id;
    string senderId;
    string recipientId;
    string content;
    string timestamp;
};

