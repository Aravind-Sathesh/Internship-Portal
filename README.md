# Internship Portal

Welcome to the Internship Portal! This application aims to seamlessly connect students from BITS Pilani with employers looking to offer internship opportunities. By facilitating profile management, application tracking, and internship listings, the platform creates an efficient experience for both students and employers.

## Tech Stack

The Internship Portal is built using a modern technology stack that enhances performance and user experience:

### Frontend:

React: A popular JavaScript library for building user interfaces, using TypeScript for type safety and improved development experience.

### Backend:

Node.js: A JavaScript runtime built on Chrome's V8 engine, enabling server-side development.  
Express: A fast web framework for Node.js, providing robust features for web and mobile applications. Utilized with TypeScript for better code maintainability.

### Database:

MySQL: A powerful relational database management system used for storing user profiles, internship listings, and application data.

### File Storage:

Google Firebase: A cloud storage solution that allows for efficient file uploads, including resumes and company logos.

### Email Service:

Nodemailer: A module for Node.js to send emails, used for functionalities like email verification and application confirmations.

### Caching:

Redis: An in-memory data structure store used for caching relevant data to improve application performance.

### Containerization:

Docker: A platform that enables developers to automate the deployment of applications within lightweight, portable containers.

## Key Features

### Student Functionality

-   Authentication: Students log in using Google OAuth, ensuring that only users from the BITS organization can access the platform.
    Profile Management: Students can create and update their profiles, including essential details like name, phone number, address, and BITS ID.
-   Internship Applications:
    -   Browse available internship listings.
    -   Apply for multiple internships and manage application statuses (view, update, or cancel).
-   Application Dashboard: A user-friendly dashboard where students can track the status of their applications and see if they are under review, scheduled for an interview, or if an offer has been made.

### Employer Functionality

-   Authentication: Employers can log in using standard email/password authentication.
-   Internship Listings: Employers have the ability to create, read, update, and delete (CRUD) internship listings, including deadlines and specific details.
-   Application Management: View all applications for posted internships and update application statuses (e.g., "Interview Scheduled," "Offer Given," or "Rejected").
-   Employer Dashboard: A dedicated dashboard for managing posted internships and reviewing applications.

## How to Run

1. Install Prerequisites:
Ensure you have the following installed on your system:
- Docker: [Download and install Docker.](https://www.docker.com/)
- Docker Compose: Included with most Docker installations. Verify it using:
```
docker-compose --version
```

2. Run the Application:
In the project root directory, execute:
```
docker-compose up
```

3. Access the Application:
Open your browser and navigate to:
```
http://localhost:5173 
```

4. Shut Down the Application:
To stop the application, press Ctrl+C in the terminal where the application is running.
To remove the containers, use:
```
docker-compose down
```

## License

This project is licensed under the MIT License.
