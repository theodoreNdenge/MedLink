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

service /user on new http:Listener(8080) {

    private final mongodb:Database TelemedicineDb;

    function init() returns error? {
        self.TelemedicineDb = check mongoDb->getDatabase("Telemedicine");
    }

    // User Registration
    // User Registration
    resource function post register(UserInput input) returns string|error {
        mongodb:Collection usersCollection = check self.TelemedicineDb->getCollection("users");

        // Check if user already exists
        User|mongodb:DatabaseError|mongodb:ApplicationError|error|() existingUser = usersCollection->findOne({
            username: input.username
        });
        if existingUser is User {
            return error("User already exists.");
        }

        // Create new user
        User newUser = {
            id: uuid:createType1AsString(),
            username: input.username,
            password: input.password // Store hashed password in production
            ,
            role: input.role
        };

        check usersCollection->insertOne(newUser);
        return "Registration successful!";
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
    resource function post login(LoginInput input) returns string|error {
        mongodb:Collection usersCollection = check self.TelemedicineDb->getCollection("users");
        stream<User, error?> resultStream = check usersCollection->aggregate([
            {
                \$match: {
                    username: input.username,
                    password: input.password // Make sure to hash passwords in production
                }
            }
        ]);
        record {User value;}|error? result = resultStream.next();
        if result is error? {
            return error("Invalid credentials");
        }
        return "Login successful!";
    }

    // Schedule Appointment
    resource function post scheduleAppointment(AppointmentInput input) returns error? {
        mongodb:Collection appointmentsCollection = check self.TelemedicineDb->getCollection("appointments");
        string _ = uuid:createType1AsString();
        Appointment appointment = {

            appointmentTime: input.appointmentTime,
            patientId: input.patientId,
            doctorId: input.doctorId,
            id: "",
            status: input.status
        };
        check appointmentsCollection->insertOne(appointment);
        return;
    }

    // Patient-Doctor Messaging
    resource function post sendMessage(MessageInput input) returns error? {
        mongodb:Collection messagesCollection = check self.TelemedicineDb->getCollection("messages");
        string _ = uuid:createType1AsString();
        Message message = {

            senderId: input.senderId,
            recipientId: input.recipientId,
            id: "",
            content: input.content,
            timestamp: input.timestamp
        };
        check messagesCollection->insertOne(message);
        return;
    }
}

// Input Types
type UserInput record {
    string username;
    string password; // In production, hash this password
    string role; // "patient" or "doctor"
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
