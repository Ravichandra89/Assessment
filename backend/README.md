## Backend

The backend of the Event Management System is built to handle all API requests, database operations, and business logic for managing events and profiles.

### Technologies Used

- **Node.js**: JavaScript runtime for building scalable server-side applications
- **Express.js**: Web framework for handling routes and middleware
- **MongoDB (Mongoose)**: NoSQL database for storing events, profiles, and user data
- **JWT (JSON Web Tokens)**: Authentication and authorization
- **Axios**: HTTP client for server-to-server communication
- **Dayjs**: Date and time handling with timezone support
- **Swagger / OpenAPI**: API documentation and testing
- **Nodemon**: Development tool for automatic server reload

## API Documentation:

### Events

curl -X POST http://localhost:5000/api/v1/events \
-H "Content-Type: application/json" \
-d '{
"title": "Team Meeting",
"description": "Discuss project roadmap",
"startUtc": "2025-10-20T03:30:00.000Z",
"endUtc": "2025-10-20T04:30:00.000Z",
"createdBy": "6712059a57b2d41594c0e3fd",
"timezone": "Asia/Kolkata",
"profiles": ["6712059a57b2d41594c0e3fd"]
}'

curl -X GET http://localhost:5000/api/v1/events

curl -X GET http://localhost:5000/api/v1/events/67127adf12e34b0012a12bcd

curl -X PUT http://localhost:5000/api/v1/events/67127adf12e34b0012a12bcd \
-H "Content-Type: application/json" \
-d '{
"title": "Tech Conference 2025 - Updated",
"description": "Updated full event details",
"startUtc": "2025-10-25T05:00:00.000Z",
"endUtc": "2025-10-25T10:00:00.000Z",
"timezone": "Asia/Kolkata",
"profiles": ["64f6c7d2e1234567890abc1"]
}'

curl -X PATCH http://localhost:5000/api/v1/events/67127adf12e34b0012a12bcd \
-H "Content-Type: application/json" \
-d '{
"description": "Added new panel discussion section"
}'

curl -X DELETE http://localhost:5000/api/v1/events/67127adf12e34b0012a12bcd

curl -X POST http://localhost:5000/api/v1/events/67127adf12e34b0012a12bcd/assign \
-H "Content-Type: application/json" \
-d '{
  "profiles": ["64f6c7d2e1234567890abc3", "64f6c7d2e1234567890abc4"]
}'

curl -X DELETE http://localhost:5000/api/v1/events/67127adf12e34b0012a12bcd/unassign/64f6c7d2e1234567890abc3

curl -X GET http://localhost:5000/api/v1/profiles

curl -X GET http://localhost:5000/api/v1/profiles/670f6c7d2e1234567890abcd


curl -X PUT http://localhost:5000/api/v1/profiles/670f6c7d2e1234567890abcd \
-H "Content-Type: application/json" \
-d '{
  "name": "Ravi Dev Kumar",
  "timezone": "Asia/Dubai"
}'


curl -X GET http://localhost:5000/api/v1/profiles/670f6c7d2e1234567890abcd/events


