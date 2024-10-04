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

    // Define the user data
    json userData = {
        username: username,
        password: password,
        role: role
    };

    // Create an HTTP client
    http:Client clientEndpoint = check new ("http://localhost:8080");

    // Make the POST request to the server-side registration endpoint
    http:Response response = check clientEndpoint->post("/user/register", userData);

    // Log the response from the server
    if (response is http:Response) {
        var responseBody = response.getJsonPayload();
        if (responseBody is json) {
            log:printInfo("Response: " + responseBody.toString());
        } else {
            log:printError("Error occurred while retrieving the JSON payload from the response");
        }
    }
}
