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

# Day 9 Progress

## Completed Features

### Conversation Memory

* Added session-based conversation history
* Previous messages are loaded from database
* AI receives complete chat context
* Messages are sent to Groq with history

### Database Integration

* Added repository method:

  * findBySessionOrderByCreatedAtAsc()
* Fetches messages in chronological order

### AI Improvements

* AI remembers previous messages in the same session
* Context-aware responses implemented
* Different sessions maintain separate memory

### Testing Completed

* Verified memory retention
* Verified session isolation
* Verified message history retrieval
* Verified Groq context passing


## Completed Features

### Frontend Authentication

* Created Login Page
* Created Register Page
* Integrated JWT Authentication
* Stored JWT token in Local Storage
* Protected Chat Page access

### Frontend Chat Interface

* Created Chat Page Layout
* Created Sidebar Component
* Created Chat Window Component
* Created Message Input Component
* Connected Frontend with Spring Boot APIs using Axios

### Session Management

* Display all user chat sessions
* Create new chat sessions
* Select and switch between sessions
* Highlight active session

### Session-Based Memory

* Load previous messages when a session is selected
* Send messages to the selected session
* AI remembers previous conversation within the same session
* Different sessions maintain separate conversation histories

### Backend Integration

* Connected frontend to:

  * GET /api/sessions
  * POST /api/sessions
  * GET /api/chat/sessions/{sessionId}/messages
  * POST /api/chat/sessions/{sessionId}/messages

### Security

* JWT token automatically attached to API requests using Axios Interceptor
* Secured backend APIs with Spring Security

### Testing Completed

#### Authentication Testing

* User Registration Tested
* User Login Tested
* JWT Token Generation Verified

#### Session Testing

* Session Creation Tested
* Session Switching Tested
* Session History Loading Tested

#### Memory Testing

Session 1:

* User: "My name is Anmol"
* User: "What is my name?"
* AI correctly responded: "Your name is Anmol"

Session 2:

* User: "What is my name?"
* AI did not know previous session information

Verified successful session-based memory isolation.

## Status

Enterprise AI Copilot now supports:

* User Authentication
* Multiple Chat Sessions
* Session-Based Conversation Memory
* Persistent Chat History
* Frontend and Backend Integration
* AI-Powered Conversations using Groq


