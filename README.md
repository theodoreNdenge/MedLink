# MedLink

## Overview

**MedLink** is a comprehensive platform designed to streamline healthcare services by leveraging modern technology. The system provides seamless integration of medical services, allowing doctors, patients to interact efficiently. The platform includes essential features such as user registration, appointment scheduling, patient-doctor messaging, and health record management, a wellness-bot.

---

## Key Features

- **User Registration & Authentication**
  - Secure user registration for both doctors and patients.
  - Role-based access control with doctors having specializations.
  - User login with validation to ensure secure authentication.

- **Doctor Appointment Scheduling**
  - Doctors can manage their schedules and appointments.
  - Patients can search for doctors based on specialization and schedule appointments.
  - Real-time conflict checking to ensure a doctor is not double-booked.

- **Patient Dashboard**
  - Patients can view all their scheduled appointments and track their medical history.
  - Health record uploading to keep all medical documents in one place.

- **Doctor Dashboard**
  - Doctors can view their appointments with patients.
  - Doctors can manage appointment status, such as marking them as "scheduled," "completed," etc.

- **Patient-Doctor Messaging**
  - Secure messaging system for communication between patients and doctors.
  - All messages are stored for future reference, providing a streamlined patient-care experience.
  - This feature is still in development.

- **Health Record Management**
  - Patients can upload their health records for doctors to review.
  - Secure storage of medical documents and easy retrieval for both patients and doctors.

- **Wellness-bot**
  - Patient can interact with a wellness-bot which can provide answer to questions that the patient might have.
  - This feacture is still in development. 

---

## Architecture & Technology Stack

### Backend:
- **Ballerina**: Powers the server-side with REST APIs for handling users, appointments, and health records.
- **MongoDB**: Used as the database for storing user data, appointments, messages, and health records.
- **Axios**: For handling API requests between the frontend and backend.

### Frontend:
- **React.js**: Frontend framework used for building an interactive user interface.
- **Axios**: Used in the frontend for making API calls to the backend server.

### Database:
- **MongoDB**: A NoSQL database used to store all the data, including users, appointments, messages, and health records.

### Authentication:
- Basic authentication using usernames and passwords. Secure password storage should be implemented in production.

---

## API Endpoints

### User Management:
- **POST** `/user/register`: Registers a new user (doctor or patient).
- **POST** `/user/login`: Authenticates a user and returns their user details along with their role.

### Doctor Appointment Management:
- **GET** `/user/doctorAppointment/[userId]`: Retrieves all appointments for the logged-in doctor.
- **POST** `/user/scheduleAppointment`: Schedules an appointment for a patient with a doctor.

### Patient Dashboard:
- **GET** `/user/patientDashboard`: Retrieves all the appointments for the logged-in patient.

### Messaging System:
- **POST** `/user/sendMessage`: Sends a message from a patient to a doctor or vice versa.
- **GET** `/user/messages/[userId]`: Retrieves all messages for a user (doctor or patient).

### Health Record Management:
- **POST** `/user/uploadHealthRecord`: Allows a patient to upload their health records for doctor review.

### Doctor Search:
- **GET** `/user/searchDoctors/[specialization]`: Finds all doctors with a specific specialization.

---

## Installation and Setup

### Prerequisites:
- **Node.js**: For running the frontend React application.
- **MongoDB**: Install MongoDB for storing user and appointment data.
- **Ballerina**: Ensure that the Ballerina runtime is installed for running the backend services.

### Clone the Repository:
```bash
git clone https://github.com/theodoreNdenge/MedLink.git
cd medlink
