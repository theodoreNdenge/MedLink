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
        return createErrorResponse("User already exists.");
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
    return createSuccessResponse("Registration successful!");
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

        // Find user by username and password
        stream<User, error?> resultStream = check usersCollection->aggregate([{
            \$match: {
                username: input.username,
                password: input.password // Ensure passwords are hashed in production
            }
        }]);

        var result = resultStream.next();
        if result is record {User value;} {
            return createSuccessResponse("Login successful!"+ result.value.id);
        } else {
            return check createErrorResponse("Invalid credentials.");
        }
    }


 resource function post scheduleAppointment(AppointmentInput input, string patientId) returns http:Response|error {
    mongodb:Collection appointmentsCollection = check self.TelemedicineDb->getCollection("appointments");

    // Check if the doctor has any appointments scheduled at the same time
    Appointment|mongodb:DatabaseError|mongodb:ApplicationError|error|() existingAppointment = appointmentsCollection->findOne({
        doctorId: input.doctorId,
        appointmentTime: input.appointmentTime
    });
    
    if existingAppointment is Appointment {
        return createErrorResponse("Doctor is not available at the selected time.");
    }

    // Proceed with scheduling the appointment if the doctor is available
    Appointment appointment = {
        id: uuid:createType1AsString(),
        appointmentTime: input.appointmentTime,
        patientId: patientId,
        doctorId: input.doctorId,
        status: input.status
    };

    check appointmentsCollection->insertOne(appointment);
    return createSuccessResponse("Appointment scheduled successfully.");
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
    return check createSuccessResponse("Message sent successfully.");
}

    // Patient Dashboard: View appointments
resource function get patientDashboard(string patientId) returns json|error {
    mongodb:Collection appointmentsCollection = check self.TelemedicineDb->getCollection("appointments");

    // Find all appointments for this patient
    stream<Appointment, error?> resultStream = check appointmentsCollection->find({patientId: patientId});
    json appointments = resultStream.toString();
    return appointments;
}

// Doctor Dashboard: View appointments
resource function get doctorDashboard(string doctorId) returns json|error {
    mongodb:Collection appointmentsCollection = check self.TelemedicineDb->getCollection("appointments");

    // Find all appointments for this doctor
    stream<Appointment, error?> resultStream = check appointmentsCollection->find({doctorId: doctorId});
    json appointments = resultStream.toString();
    return appointments;
}

    
}

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
    string status; // e.g., "scheduled", "completed"
};

type MessageInput record {
    string senderId; // ID of the patient or doctor
    string recipientId; // ID of the other party
    string content;
    string timestamp;
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
};

type Message record {
    string id;
    string senderId;
    string recipientId;
    string content;
    string timestamp;
};
