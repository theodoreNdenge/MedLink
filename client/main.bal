import ballerina/http;
import ballerina/io;
import ballerina/log;

public function main() returns error? {
    // Prompt the user for input
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

    // Define the user data
    json userData = {
        username: username,
        password: password, // Remember to hash this password on the server side in production!
        role: role,
        specialization: role == "doctor" ? specialization : ""
    };

    // Create an HTTP client
    http:Client clientEndpoint = check new ("http://localhost:8080");

    // Make the POST request to the server-side registration endpoint
    http:Response response = check clientEndpoint->post("/user/register", userData);

    // Log the response from the server
    if (response is http:Response) {
        // Check if response content type is JSON before attempting to get JSON payload
        string contentType = check response.getHeader("content-type");

        if contentType.startsWith("application/json") { // Check if it's JSON
            json|error responseBody = response.getJsonPayload();
            if responseBody is json {
                string message = (check responseBody.message).toString();
                if (response.statusCode == 200) {
                    // Optionally, print the success message for the user
                    io:println( message);
                } else {
                    // Handle registration errors
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
    } else {
        
        
    }
}
