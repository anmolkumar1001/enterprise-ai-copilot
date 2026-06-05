# Enterprise AI Copilot - Progress Log

## Day 1

* Setup Spring Boot
* Setup PostgreSQL
* Setup React
* Setup GitHub
* Created project structure
* Connected Spring Boot with PostgreSQL
* Created first REST API

## Day 2

* Created User Entity
* Created User Repository
* Created RegisterRequest DTO
* Implemented User Service
* Implemented Auth Controller
* Built User Registration API
* Tested Registration API using Postman
* Verified user data stored in PostgreSQL

## Day 3

* Added BCrypt Password Encoder
* Implemented password hashing before storing user data
* Created LoginRequest DTO
* Built Login API
* Added password verification using BCrypt
* Added duplicate email validation
* Tested Login API using Postman
* Verified encrypted passwords stored in PostgreSQL
* Updated project documentation
* Pushed authentication module to GitHub

## Day 4
- Implemented JWT token generation
- Implemented JWT token validation
- Protected Profile API using JWT
- Moved database credentials to environment variables
- Moved JWT secret to environment variables
- Resolved Git merge conflicts
- Learned Git rebase workflow
- Successfully pushed secure code to GitHub

# Day 5 Progress - JWT Authentication & Authorization

## Completed Features

### Authentication

* Implemented JWT token generation after successful login.
* Added JWT token validation.
* Extracted user information from JWT tokens.

### Spring Security

* Configured Spring Security for stateless authentication.
* Disabled session-based authentication.
* Added custom security configuration.

### JWT Filter

* Created a custom JWT authentication filter.
* Intercepts incoming requests and validates JWT tokens.
* Sets authentication in Security Context.

### UserDetailsService

* Implemented custom UserDetailsService.
* Loads user information from PostgreSQL database.
* Integrated with Spring Security authentication flow.

### Security Context

* Successfully stored authenticated user details in SecurityContextHolder.
* Enabled authenticated access to protected endpoints.

### Role-Based Access Control (RBAC)

* Added USER and ADMIN roles.
* Configured role-based endpoint authorization.
* Restricted admin-only APIs using role checks.

## Technologies Used

* Spring Boot
* Spring Security
* JWT (JJWT)
* PostgreSQL
* JPA/Hibernate
* BCrypt Password Encoder

## Learning Outcomes

* Understood stateless authentication using JWT.
* Learned Spring Security filter chain.
* Implemented custom authentication flow.
* Applied role-based authorization.
* Secured REST APIs using JWT tokens.


# Day 6 Progress

## Features Completed

- Created Chat entity
- Implemented ChatRepository
- Added ChatService
- Added ChatController
- Created Create Chat API
- Created Get Chats API
- Created Delete Chat API
- Linked chats with authenticated users
- Tested APIs using JWT authentication

## Endpoints

POST /api/chat
GET /api/chat
DELETE /api/chat/{id}

# Day 7 Progress Report

## Completed Features

### ✅ AI Service Integration

* Integrated Groq LLM API with Spring Boot.
* Configured API key using environment variables.
* Created service layer for AI communication.

### ✅ AI Chat Response Generation

* User messages are sent to Groq API.
* AI-generated responses are received dynamically.
* Responses are stored in the database.

### ✅ Chat Persistence

* User prompt stored in `userMessage`.
* AI reply stored in `aiResponse`.
* Chat history saved with timestamp.

### ✅ Chat API Updated

* POST `/api/chat`

  * Creates a chat
  * Sends prompt to AI
  * Stores AI response
  * Returns complete chat object

### ✅ Security Integration

* JWT authentication working with chat endpoints.
* Authenticated user automatically linked to chats.

### ✅ Database Integration

* Chat entity persisted successfully.
* User-to-chat relationship working correctly.

## Files Added / Updated

### New Files

* `AiService.java`

### Updated Files

* `ChatService.java`
* `application.properties`
* `ChatController.java`

## Sample Flow

1. User logs in.
2. JWT token generated.
3. User calls `/api/chat`.
4. Backend validates JWT.
5. Prompt sent to Groq.
6. AI response received.
7. Chat stored in PostgreSQL.
8. Response returned to client.

## Status

Day 7 completed successfully.

Current Features:

* Authentication
* Authorization
* JWT Security
* Chat Management
* AI Integration


# Day 8 Progress

## Completed Features

### Chat Sessions

* Created ChatSession entity
* Added ChatSessionRepository
* Added ChatSessionService
* Added ChatSessionController
* Users can create multiple chat sessions

### Session Based Conversations

* Linked Chat entity with ChatSession
* Added session_id foreign key
* Messages are now grouped by conversation

### APIs Implemented

#### Session APIs

* POST /api/sessions
* GET /api/sessions

#### Message APIs

* POST /api/chat/sessions/{sessionId}/messages
* GET /api/chat/sessions/{sessionId}/messages
* DELETE /api/chat/{id}

### AI Integration

* Groq AI responses stored with messages
* Session history preserved

### Database Design

* User → ChatSession (One To Many)
* ChatSession → Chat (One To Many)

### Optional Features

* Like Message API
* Dislike Message API

## Status

Day 8 Completed Successfully
Backend now supports ChatGPT-style conversations with session management.
