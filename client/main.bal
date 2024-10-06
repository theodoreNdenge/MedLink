import ballerina/http;
import ballerina/io;
import ballerina/log;

public function main() returns error? {
    // Create an HTTP client
    http:Client clientEndpoint = check new ("http://localhost:8080");

    while (true) {
        // Prompt the user for action
        io:println("1. Register");
        io:println("2. Login");
        io:println("3. Exit");
        string option1 = io:readln();

        match option1 {
            "1" => {
                io:println("Register");
                io:println("Enter username:");
                string username = io:readln();

                io:println("Enter password:");
                string password = io:readln();

                io:println("Enter role (patient/doctor):");
                string role = io:readln();

                string specialization = "";

                // If the user is a doctor, prompt for specialization
                if (role == "doctor") {
                    io:println("Enter specialization:");
                    specialization = io:readln();
                }

                // Call the registerUser function
                check registerUser(clientEndpoint, username, password, role, specialization);         
                io:println("Registration successful! Please log in.");
            }
            "2" => {
                io:println("Login"); 
                io:println("Enter username:");
                string username = io:readln();

                io:println("Enter password:");
                string password = io:readln();
                
                var loginResponse = loginUser(clientEndpoint, username, password);
                if (loginResponse is error) {
                    io:println("Login failed: " + loginResponse.message());
                    return;
                }

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
                    io:println("Welcome "+ username);
                    check patientDashboard(clientEndpoint);
                } else {
                    io:println("Unknown role. Please contact support.");
                }
            }
            "3" => {
                io:println("Exiting the application.");
                return; // Exit the application
            }
            _ => {
                io:println("Invalid option");
            }
        }
    }
}

// Function to register a user
function registerUser(http:Client clientEndpoint, string username, string password, string role, string specialization) returns error? {
    // Define the user data
    json userData = {
        username: username,
        password: password, // Remember to hash this password in production!
        role: role,
        specialization: role == "doctor" ? specialization : ""
    };

    // Make the POST request to the server-side registration endpoint
    http:Response Register = check clientEndpoint->post("/user/register", userData);

    // Log and handle the response from the server
    if (Register is http:Response) {
        // Check if response content type is JSON before attempting to get JSON payload
        string contentType = check Register.getHeader("content-type");

        if contentType.startsWith("application/json") {
            json|error responseBody = Register.getJsonPayload();
            if responseBody is json {
                string message = (check responseBody.message).toString();
                if (Register.statusCode == 200) {
                    io:println("Registration Successful: ", message);
                } else {
                    io:println("Registration Failed: ", message);
                }
            } else {
                log:printError("Error occurred while retrieving the JSON payload from the response.");
                io:println("An error occurred during registration. Please try again.");
            }
        } else {
            log:printError("Expected JSON response, but got content type: " + contentType);
            io:println("Unexpected response from server. Please contact support.");
        }
    }
    return;
}

// Function to log in a user
function loginUser(http:Client clientEndpoint, string username, string password) returns json|error {
    // Define login data
    json loginData = {
        username: username,
        password: password
    };

    // Make the POST request to the login endpoint
    http:Response Login = check clientEndpoint->post("/user/login", loginData);

    // Extract the response payload
    if (Login is http:Response) {
        string contentType = check Login.getHeader("content-type");

        if contentType.startsWith("application/json") {
            json|error responseBody = Login.getJsonPayload();
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
// Function to search for doctors by specialization
function searchDoctors(http:Client clientEndpoint, string specialization) returns error? {
    // Make a GET request to search for doctors by specialization
    http:Response response = check clientEndpoint->get("/user/searchDoctors?specialization=" + specialization);

    // Print the entire response for debugging
    io:println("Raw response: ", response.getTextPayload());

    // Check if the response is JSON
    string contentType = check response.getHeader("content-type");
    io:println("Content type: ", contentType); // Debug content type

    if contentType.startsWith("application/json") {
        json|error jsonResponse = response.getJsonPayload();
        if jsonResponse is json {
            // Print the list of doctors returned by the server
            io:println("Doctors found with specialization '" + specialization + "':");
            io:println(jsonResponse.toString());
        } else {
            log:printError("Error occurred while retrieving the JSON payload from the response.");
            io:println("An error occurred while searching for doctors.");
        }
    } else {
        io:println("Unexpected response format from server. Please contact support.");
    }
    return;
}
// Function to schedule an appointment
function scheduleAppointment(http:Client clientEndpoint, string doctorId, string date, string time) returns json|error {
    // Define appointment data
    json appointmentData = {
        doctorId: doctorId,
        date: date,
        time: time
    };

    // Make the POST request to schedule the appointment
    http:Response response = check clientEndpoint->post("/appointments/schedule", appointmentData);
    json responseBody = check response.getJsonPayload();
    return responseBody;
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
function patientDashboard(http:Client clientEndpoint) returns error? {
    // Display patient options and handle patient-specific operations
    io:println("1. Search for Doctors");
    io:println("2. Schedule Appointment");
    io:println("3. Upload Health Record");
    io:println("4. Message Doctor");

    string option = io:readln();
    match option {
        "1" => {   io:println("Enter specialization to search for doctors:");
            string specialization = io:readln();
            check searchDoctors(clientEndpoint, specialization);
        
        
        }
        "2" => { io:println("Enter Doctor's ID to schedule an appointment:");
            string doctorId = io:readln();

            io:println("Enter preferred date (YYYY-MM-DD):");
            string date = io:readln();

            io:println("Enter preferred time (HH:MM):");
            string time = io:readln();

            // Call the scheduleAppointment function
            var appointmentResponse = scheduleAppointment(clientEndpoint, doctorId, date, time);
            if (appointmentResponse is error) {
                io:println("Failed to schedule appointment: " + appointmentResponse.message());
                return;
            }

            io:println("Appointment successfully scheduled!");
        }
        
        
        "3" => {io:println("Uploading health record...");
        
        
    }
        "4" => {io:println("Messaging doctor...");}
        _ =>{ io:println("Invalid option");}
    }
}
