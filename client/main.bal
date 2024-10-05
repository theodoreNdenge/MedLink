import ballerina/http;
import ballerina/io;


public function main() returns error? {
    // Prompt the user for login details
    io:println("Enter username:");
    string username = io:readln();

    io:println("Enter password:");
    string password = io:readln();

    // Attempt to log in
    var loginResponse = loginUser(username, password);
    if (loginResponse is error) {
        io:println("Login failed: " + loginResponse.message());
        return;
    }

    // Extract the 'message' field from the JSON response
   json userResponse = <json>loginResponse;
    string message = (check userResponse.message).toString();

    // Extract the 'role' from the message string
    string role = extractRoleFromMessage(message);
    if (role == "") {
        io:println("Could not determine the user's role.");
        return;
    }

    // Check role and proceed to the relevant dashboard
    if (role == "doctor") {
        io:println("Welcome Doctor!");
        doctorDashboard();
    } else if (role == "patient") {
        io:println("Welcome Patient!");
        patientDashboard();
    } else {
        io:println("Unknown role. Please contact support.");
    }
}

// Function to log in a user
function loginUser(string username, string password) returns json|error {
    // Create an HTTP client
    http:Client clientEndpoint = check new ("http://localhost:8080");

    // Define login data
    json loginData = {
        username: username,
        password: password
    };

    // Make the POST request to the login endpoint
    http:Response response = check clientEndpoint->post("/user/login", loginData);

    // Extract the response payload
    if (response is http:Response) {
        string contentType = check response.getHeader("content-type");

        if contentType.startsWith("application/json") {
            json|error responseBody = response.getJsonPayload();
            if responseBody is json {
                return responseBody; // Return the login response with user data
            }
        }
    }
    return error("Login failed");
}

// Function to extract the role from the login response message
function extractRoleFromMessage(string message) returns string {
    if message.includes("Role: patient") {
        return "patient";
    } else if message.includes("Role: doctor") {
        return "doctor";
    }
    return "";
}

// Function for doctor dashboard and features
function doctorDashboard() {
    // Display doctor options and handle doctor-specific operations
    io:println("1. View Patients");
    io:println("2. Respond to Messages");
    io:println("3. View Scheduled Appointments");

    string option = io:readln();
    match option {
        "1" => {io:println("Fetching patient list...");}
        "2" => {io:println("Fetching messages...");}
        "3" => {io:println("Fetching appointments...");}
        _ =>{ io:println("Invalid option");}
    }
}

// Function for patient dashboard and features
function patientDashboard() {
    // Display patient options and handle patient-specific operations
    io:println("1. Search for Doctors");
    io:println("2. Schedule Appointment");
    io:println("3. Upload Health Record");
    io:println("4. Message Doctor");

    string option = io:readln();
    match option {
        "1" => {io:println("Enter specialization to search for doctors:");}
        "2" => {io:println("Scheduling appointment...");}
        "3" => {io:println("Uploading health record...");}
        "4" => {io:println("Messaging doctor...");}
        _ =>{ io:println("Invalid option");}
    }
}
