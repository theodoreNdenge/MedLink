import ballerina/http;
import ballerina/log;

// Define a simple in-memory map for user data
map<json> patients = {};
map<json> doctors = {};

// Define the HTTP service on port 8080
service /users on new http:Listener(8080) {

    // Register a new patient
    resource function post registerPatient(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
         string patientId = (check payload.id).toString();

        // Validate if the patient ID already exists
        if patients.hasKey(patientId) {
            check caller->respond({ "message": "Patient already registered." });
            return;
        }

        // Register the new patient
        patients[patientId] = payload;
        log:printInfo("New patient registered: " + patientId);

        check caller->respond({ "message": "Patient registered successfully!" });
    }

    // Register a new doctor
    resource function post registerDoctor(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
         string doctorId = (check payload.id).toString();

        // Validate if the doctor ID already exists
        if doctors.hasKey(doctorId) {
            check caller->respond({ "message": "Doctor already registered." });
            return;
        }

        // Register the new doctor
        doctors[doctorId] = payload;
        log:printInfo("New doctor registered: " + doctorId);

        check caller->respond({ "message": "Doctor registered successfully!" });
    }

    // Get a patient's profile
    resource function get getPatient(http:Caller caller, http:Request req, string id) returns error? {
        if patients.hasKey(id) {
            json patientProfile = patients[id];
            check caller->respond(patientProfile);
        } else {
            check caller->respond({ "message": "Patient not found." });
        }
    }

    // Get a doctor's profile
    resource function get getDoctor(http:Caller caller, http:Request req, string id) returns error? {
        if doctors.hasKey(id) {
            json doctorProfile = doctors[id];
            check caller->respond(doctorProfile);
        } else {
            check caller->respond({ "message": "Doctor not found." });
        }
    }

    // Update a patient's profile
    resource function put updatePatient(http:Caller caller, http:Request req, string id) returns error? {
        if patients.hasKey(id) {
            json updatedProfile = check req.getJsonPayload();
            patients[id] = updatedProfile;
            log:printInfo("Patient profile updated: " + id);
            check caller->respond({ "message": "Patient profile updated successfully!" });
        } else {
            check caller->respond({ "message": "Patient not found." });
        }
    }

    // Update a doctor's profile
    resource function put updateDoctor(http:Caller caller, http:Request req, string id) returns error? {
        if doctors.hasKey(id){
            json updatedProfile = check req.getJsonPayload();
            doctors[id] = updatedProfile;
            log:printInfo("Doctor profile updated: " + id);
            check caller->respond({ "message": "Doctor profile updated successfully!" });
        } else {
            check caller->respond({ "message": "Doctor not found." });
        }
    }

    // Delete a patient's profile
    resource function delete deletePatient(http:Caller caller, http:Request req, string id) returns error? {
        if patients.hasKey(id) {
            _ =patients.remove(id);
            log:printInfo("Patient deleted: " + id);
            check caller->respond({ "message": "Patient profile deleted successfully!" });
        } else {
            check caller->respond({ "message": "Patient not found." });
        }
    }

    // Delete a doctor's profile
    resource function delete deleteDoctor(http:Caller caller, http:Request req, string id) returns error? {
        if doctors.hasKey(id){
            _ = doctors.remove(id);
            log:printInfo("Doctor deleted: " + id);
            check caller->respond({ "message": "Doctor profile deleted successfully!" });
        } else {
            check caller->respond({ "message": "Doctor not found." });
        }
    }
}

