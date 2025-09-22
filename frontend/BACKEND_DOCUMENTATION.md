# Colten Tenant Management System - Backend Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Authentication & Security](#authentication--security)
5. [API Endpoints](#api-endpoints)
6. [Models & Entities](#models--entities)
7. [Configuration](#configuration)
8. [Development Setup](#development-setup)
9. [Testing](#testing)
10. [Deployment Notes](#deployment-notes)

---

## Project Overview

**Colten** is a comprehensive tenant management system built with Spring Boot 3.5.4 and Java 24. The system manages property owners, buildings, units, tenants, maintenance issues, and payments with Stripe integration.

### Key Features
- JWT-based authentication with role-based access control
- Building and unit management with room code system
- Tenant registration via room codes
- Issue tracking and management
- Payment processing with Stripe integration
- Dashboard APIs for owners and tenants
- H2 database for development with JPA/Hibernate

### Technology Stack
- **Framework**: Spring Boot 3.5.4
- **Java Version**: 24
- **Database**: H2 (in-memory for development)
- **ORM**: Hibernate 6.6.22
- **Security**: Spring Security 6.x with JWT
- **Payment**: Stripe API integration
- **Build Tool**: Maven
- **Server**: Embedded Tomcat (port 8080)

---

## Architecture

### Project Structure
```
src/
├── main/
│   ├── java/com/example/Colten/
│   │   ├── ColtenApplication.java
│   │   ├── config/
│   │   │   └── WebSecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── BuildingController.java
│   │   │   ├── DashboardController.java
│   │   │   ├── IssueController.java
│   │   │   ├── PaymentController.java
│   │   │   ├── TenantController.java
│   │   │   └── UnitController.java
│   │   ├── dto/
│   │   │   ├── AuthResponse.java
│   │   │   ├── IssueRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── PaymentRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── RoomCodeRequest.java
│   │   │   └── TenantRegistrationRequest.java
│   │   ├── model/
│   │   │   ├── Building.java
│   │   │   ├── Issue.java
│   │   │   ├── Owner.java
│   │   │   ├── Payment.java
│   │   │   ├── Tenant.java
│   │   │   ├── Unit.java
│   │   │   ├── User.java
│   │   │   └── [Enums]
│   │   ├── repository/
│   │   │   ├── BuildingRepository.java
│   │   │   ├── IssueRepository.java
│   │   │   ├── OwnerRepository.java
│   │   │   ├── PaymentRepository.java
│   │   │   ├── TenantRepository.java
│   │   │   ├── UnitRepository.java
│   │   │   └── UserRepository.java
│   │   ├── security/
│   │   │   ├── JwtAuthenticationEntryPoint.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtUtils.java
│   │   │   └── UserDetailsImpl.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       ├── PaymentService.java
│   │       └── UserDetailsServiceImpl.java
│   └── resources/
│       └── application.properties
```

### Design Patterns
- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: Data transfer objects for API requests/responses
- **Service Layer Pattern**: Business logic separation
- **JWT Token Authentication**: Stateless authentication
- **Role-based Access Control**: Owner/Tenant permissions

---

## Database Schema

### Core Entities Relationships

```
User (Base Entity)
├── Owner (extends User)
│   └── Buildings (1:N)
│       └── Units (1:N)
│           ├── Tenant (1:1)
│           ├── Issues (1:N)
│           └── Payments (1:N)
└── Tenant (extends User)
    ├── Unit (N:1)
    ├── Issues (1:N)
    └── Payments (1:N)
```

### Entity Details

#### User (Abstract Base Class)
- `id` (Long, Primary Key)
- `email` (String, Unique)
- `password` (String, BCrypt Encoded)
- `firstName` (String)
- `lastName` (String)
- `phoneNumber` (String)
- `role` (Enum: OWNER, TENANT)
- `createdAt` (LocalDateTime)
- `updatedAt` (LocalDateTime)

#### Owner (extends User)
- `companyName` (String, Optional)
- `buildings` (List<Building>)

#### Tenant (extends User)
- `unit` (Unit)
- `backgroundCheckStatus` (Enum)
- `emergencyContactName` (String)
- `emergencyContactPhone` (String)
- `employmentInfo` (String)
- `moveInDate` (LocalDate)
- `moveOutDate` (LocalDate, Optional)

#### Building
- `id` (Long, Primary Key)
- `name` (String)
- `address` (String)
- `city` (String)
- `state` (String)
- `zipCode` (String)
- `numberOfUnits` (Integer)
- `owner` (Owner, Many-to-One)
- `units` (List<Unit>)
- `createdAt` (LocalDateTime)

#### Unit
- `id` (Long, Primary Key)
- `unitNumber` (String)
- `floor` (Integer)
- `bedrooms` (Integer)
- `bathrooms` (Double)
- `squareFeet` (Integer)
- `monthlyRent` (BigDecimal)
- `securityDeposit` (BigDecimal)
- `unitType` (Enum: STUDIO, ONE_BEDROOM, TWO_BEDROOM, THREE_BEDROOM, PENTHOUSE)
- `isAvailable` (Boolean)
- `roomCode` (String, Unique, 8 characters)
- `description` (Text)
- `furnished` (Boolean)
- `petsAllowed` (Boolean)
- `smokingAllowed` (Boolean)
- `hasAirConditioning` (Boolean)
- `hasWashingMachine` (Boolean)
- `hasDishwasher` (Boolean)
- `hasBalcony` (Boolean)
- `leaseStartDate` (LocalDate)
- `leaseEndDate` (LocalDate)
- `building` (Building, Many-to-One)
- `tenant` (Tenant, One-to-One, Optional)
- `issues` (List<Issue>)
- `payments` (List<Payment>)

#### Issue
- `id` (Long, Primary Key)
- `title` (String)
- `description` (Text)
- `category` (Enum: PLUMBING, ELECTRICAL, HEATING_COOLING, APPLIANCE, MAINTENANCE, SECURITY, OTHER)
- `priority` (Enum: LOW, MEDIUM, URGENT, EMERGENCY)
- `status` (Enum: OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `tenant` (Tenant, Many-to-One)
- `unit` (Unit, Many-to-One)
- `assignedTo` (User, Many-to-One, Optional)
- `createdAt` (LocalDateTime)
- `updatedAt` (LocalDateTime)
- `resolvedAt` (LocalDateTime, Optional)

#### Payment
- `id` (Long, Primary Key)
- `amount` (BigDecimal)
- `paymentDate` (LocalDateTime)
- `dueDate` (LocalDate)
- `paymentType` (Enum: RENT, SECURITY_DEPOSIT, LATE_FEE, UTILITY, OTHER)
- `paymentMethod` (Enum: CREDIT_CARD, BANK_TRANSFER, CHECK, CASH, STRIPE)
- `status` (Enum: PENDING, COMPLETED, FAILED, REFUNDED)
- `stripePaymentIntentId` (String, Optional)
- `description` (String)
- `tenant` (Tenant, Many-to-One)
- `unit` (Unit, Many-to-One)
- `createdAt` (LocalDateTime)

---

## Authentication & Security

### JWT Configuration
- **Secret Key**: `ColtenSecretKey2025ForTenantManagementAppWithMoreSecurity`
- **Expiration**: 24 hours (86400000 ms)
- **Token Type**: Bearer
- **Header**: `Authorization: Bearer <token>`

### Security Configuration
```java
// Public endpoints (no authentication required)
/api/auth/**
/h2-console/**

// Protected endpoints
/api/buildings/** - OWNER role required
/api/units/** - OWNER role required (except /available)
/api/issues/** - OWNER or TENANT role required
/api/payments/** - OWNER or TENANT role required
/api/tenants/** - OWNER role required
/api/dashboard/** - OWNER or TENANT role required
```

### Password Security
- **Encoding**: BCrypt with strength 12
- **Validation**: Minimum requirements enforced in frontend
- **Storage**: Never stored in plain text

### Role-Based Access Control
- **OWNER**: Full access to their buildings, units, tenants, issues, payments
- **TENANT**: Access to their own unit, issues, payments

---

## API Endpoints

### Authentication Endpoints (`/api/auth`)

#### POST `/api/auth/register` ✅ TESTED
Register a new owner account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "owner@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "OWNER",
  "companyName": "ABC Properties"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lckBleGFtcGxlLmNvbSIsImlhdCI6MTc1NDc1NzkwNCwiZXhwIjoxNzU0ODQ0MzA0fQ.X25pQ4MkMsveMyEwfQSUalLsmV72Ae8ZCLpL1jGcGrk",
  "type": "Bearer",
  "id": 1,
  "email": "owner@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": ["ROLE_OWNER"]
}
```

**Validation Rules:**
- `firstName`: Required, not blank
- `lastName`: Required, not blank  
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `phone`: Required, not blank
- `role`: Required, must be "OWNER" or "TENANT"
- `companyName`: Optional for owners

**Error Response (400 Bad Request):**
```json
{
  "timestamp": "2025-08-11T17:30:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already exists!",
  "path": "/api/auth/register"
}
```

#### POST `/api/auth/login` ✅ TESTED
Login with email and password.

**Request Body:**
```json
{
  "email": "owner@example.com",
  "password": "password123"
}
```

**Response (200 OK):** Same as register response.

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Error Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-08-11T17:30:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "path": "/api/auth/login"
}
```

#### GET `/api/auth/test`
Test endpoint to verify auth controller is working.

**Response (200 OK):**
```json
{
  "token": null,
  "type": "Bearer",
  "id": null,
  "email": null,
  "firstName": null,
  "lastName": null,
  "role": null,
  "message": "Authentication endpoints are working!"
}
```

---

### Building Management (`/api/buildings`) 🔒 OWNER ONLY

**Required Header:** `Authorization: Bearer <jwt_token>`

#### GET `/api/buildings`
Get all buildings for the authenticated owner.

**Headers:** 
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Sunset Apartments",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "description": "Modern apartment complex",
    "floors": 5,
    "yearBuilt": 2020,
    "parkingSpaces": 20,
    "hasElevator": true,
    "hasLaundry": true,
    "hasGym": false,
    "hasPool": false,
    "petFriendly": true,
    "imageUrl": null,
    "createdAt": "2025-08-11T10:00:00",
    "updatedAt": null
  }
]
```

#### POST `/api/buildings`
Create a new building.

**Request Body:**
```json
{
  "name": "New Apartment Complex",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90210",
  "country": "USA",
  "description": "Luxury apartment complex",
  "floors": 8,
  "yearBuilt": 2023,
  "parkingSpaces": 50,
  "hasElevator": true,
  "hasLaundry": true,
  "hasGym": true,
  "hasPool": true,
  "petFriendly": false,
  "imageUrl": "https://example.com/building.jpg"
}
```

**Required Fields:**
- `name`: String, max 100 chars, not blank
- `address`: String, max 200 chars, not blank
- `floors`: Integer, positive number, required

**Optional Fields:**
- `city`: String, max 100 chars
- `state`: String, max 100 chars  
- `zipCode`: String, max 20 chars
- `country`: String, max 100 chars (defaults to "USA")
- `description`: String, max 500 chars
- `yearBuilt`: Integer
- `parkingSpaces`: Integer
- `hasElevator`: Boolean (defaults to false)
- `hasLaundry`: Boolean (defaults to false)
- `hasGym`: Boolean (defaults to false)
- `hasPool`: Boolean (defaults to false)
- `petFriendly`: Boolean (defaults to false)
- `imageUrl`: String

**Response (200 OK):** Returns the created building with generated ID and timestamps.

#### GET `/api/buildings/{id}`
Get a specific building by ID (owner verification applied).

**Response (200 OK):** Single building object.
**Response (404 Not Found):** Building not found or not owned by user.

#### PUT `/api/buildings/{id}`
Update an existing building.

**Request Body:** Same as POST, all fields optional except those marked required.
**Response (200 OK):** Returns updated building.
**Response (404 Not Found):** Building not found or not owned by user.

#### DELETE `/api/buildings/{id}`
Delete a building (cascades to units, tenants, issues, payments).

**Response (200 OK):** Empty response body.
**Response (404 Not Found):** Building not found or not owned by user.

**⚠️ Warning:** This operation permanently deletes the building and ALL associated data including units, tenants, issues, and payments.

---

### Unit Management (`/api/units`)

#### GET `/api/units` 🔒 OWNER
Get all units for the authenticated owner.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "unitNumber": "101",
    "floor": 1,
    "bedrooms": 2,
    "bathrooms": 1.5,
    "squareFeet": 850,
    "monthlyRent": 2500.00,
    "securityDeposit": 2500.00,
    "description": "Modern 2BR with balcony",
    "unitType": "APARTMENT",
    "hasBalcony": true,
    "hasDishwasher": true,
    "hasWashingMachine": false,
    "hasAirConditioning": true,
    "furnished": false,
    "petsAllowed": true,
    "smokingAllowed": false,
    "isAvailable": true,
    "roomCode": "ABC12345",
    "leaseStartDate": null,
    "leaseEndDate": null,
    "createdAt": "2025-08-11T10:00:00",
    "updatedAt": null,
    "building": {
      "id": 1,
      "name": "Sunset Apartments"
    }
  }
]
```

#### GET `/api/units/building/{buildingId}` 🔒 OWNER
Get all units for a specific building.

**Response (200 OK):** Array of units for the building.
**Response (404 Not Found):** Building not found or not owned by user.

#### GET `/api/units/building/{buildingId}/available` 🌐 PUBLIC
Get available units for a building (public endpoint for tenant browsing).

**Response (200 OK):** Array of available units (isAvailable = true).

#### GET `/api/units/{id}` 🔒 OWNER
Get a specific unit by ID.

**Response (200 OK):** Single unit object.
**Response (404 Not Found):** Unit not found or not owned by user.

#### POST `/api/units` 🔒 OWNER
Create a new unit (room code auto-generated).

**Request Body:**
```json
{
  "unitNumber": "202",
  "floor": 2,
  "bedrooms": 1,
  "bathrooms": 1.0,
  "squareFeet": 650,
  "monthlyRent": 2000.00,
  "securityDeposit": 2000.00,
  "description": "Cozy 1BR apartment",
  "unitType": "APARTMENT",
  "hasBalcony": false,
  "hasDishwasher": true,
  "hasWashingMachine": true,
  "hasAirConditioning": true,
  "furnished": false,
  "petsAllowed": false,
  "smokingAllowed": false,
  "isAvailable": true,
  "leaseStartDate": "2025-09-01T00:00:00",
  "leaseEndDate": "2026-08-31T23:59:59",
  "buildingId": 1
}
```

**Required Fields:**
- `unitNumber`: String, max 20 chars, not blank
- `floor`: Integer, positive, required
- `bedrooms`: Integer, required
- `bathrooms`: BigDecimal, minimum 0.5, required
- `squareFeet`: Integer, positive, required
- `monthlyRent`: BigDecimal, non-negative, required
- `buildingId`: Long, required (must be owned by user)

**Optional Fields:**
- `securityDeposit`: BigDecimal
- `description`: String, max 500 chars
- `unitType`: Enum (STUDIO, APARTMENT, TOWNHOUSE, PENTHOUSE) - defaults to APARTMENT
- `hasBalcony`: Boolean (defaults to false)
- `hasDishwasher`: Boolean (defaults to false)
- `hasWashingMachine`: Boolean (defaults to false)
- `hasAirConditioning`: Boolean (defaults to false)
- `furnished`: Boolean (defaults to false)
- `petsAllowed`: Boolean (defaults to false)
- `smokingAllowed`: Boolean (defaults to false)
- `isAvailable`: Boolean (defaults to true)
- `leaseStartDate`: LocalDateTime
- `leaseEndDate`: LocalDateTime

**Response (200 OK):** Returns created unit DTO with auto-generated 8-character `roomCode`.

#### PUT `/api/units/{id}` 🔒 OWNER
Update unit details.

**Request Body:** Same as POST, all fields optional except building relationship.
**Response (200 OK):** Returns updated unit.

#### POST `/api/units/{id}/regenerate-room-code` 🔒 OWNER
Generate a new room code for the unit.

**Response (200 OK):** Returns unit with new roomCode.

#### DELETE `/api/units/{id}` 🔒 OWNER
Delete a unit (cascades to tenant, issues, payments).

**Response (200 OK):** Empty response body.
**⚠️ Warning:** Permanently deletes unit and all associated data.

---

### Tenant Management (`/api/tenants`)

#### POST `/api/tenants/validate-room-code` 🌐 PUBLIC
Validate a room code before tenant registration.

**Request Body:**
```json
{
  "roomCode": "ABC12345"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "unitNumber": "101",
  "floor": 1,
  "bedrooms": 2,
  "bathrooms": 1.5,
  "squareFeet": 850,
  "monthlyRent": 2500.00,
  "securityDeposit": 2500.00,
  "description": "Modern 2BR with balcony",
  "unitType": "APARTMENT",
  "isAvailable": true,
  "roomCode": "ABC12345",
  "building": {
    "id": 1,
    "name": "Sunset Apartments",
    "address": "123 Main St"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Error: Invalid room code!"
}
```
or
```json
{
  "message": "Error: This unit is not available!"
}
```

#### POST `/api/tenants/register` 🌐 PUBLIC
Register a new tenant with room code (automatically logs in user).

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "password": "securepass123",
  "phone": "+1234567890",
  "roomCode": "ABC12345",
  "dateOfBirth": "1990-05-15",
  "employer": "Tech Corp",
  "jobTitle": "Software Engineer",
  "monthlyIncome": 5000.00,
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1987654321",
  "numberOfOccupants": 2,
  "hasPets": true,
  "petDescription": "Small dog, golden retriever",
  "smoker": false,
  "leaseStartDate": "2025-09-01",
  "leaseEndDate": "2026-08-31",
  "moveInDate": "2025-09-01"
}
```

**Required Fields:**
- `firstName`: String, max 50 chars, not blank
- `lastName`: String, max 50 chars, not blank
- `email`: String, valid email format, max 100 chars, must be unique
- `password`: String, 6-255 chars, not blank
- `roomCode`: String, exactly 8 chars, must be valid and available

**Optional Fields:**
- `phone`: String, max 20 chars
- `dateOfBirth`: LocalDate, must be in the past
- `employer`: String, max 100 chars
- `jobTitle`: String, max 100 chars
- `monthlyIncome`: BigDecimal, positive amount, max 8 digits with 2 decimals
- `emergencyContactName`: String, max 100 chars
- `emergencyContactPhone`: String, max 20 chars
- `numberOfOccupants`: Integer, minimum 1
- `hasPets`: Boolean (defaults to false)
- `petDescription`: String, max 200 chars
- `smoker`: Boolean (defaults to false)
- `leaseStartDate`: LocalDate, must be in future
- `leaseEndDate`: LocalDate, must be in future
- `moveInDate`: LocalDate, must be in future

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 2,
  "email": "john.doe@email.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "TENANT"
}
```

**Note:** Unit automatically marked as unavailable and lease dates updated.

#### GET `/api/tenants` 🔒 OWNER
Get all tenants for the authenticated owner's buildings.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-05-15T00:00:00",
    "employer": "Tech Corp",
    "jobTitle": "Software Engineer",
    "monthlyIncome": 5000.00,
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1987654321",
    "numberOfOccupants": 2,
    "hasPets": true,
    "petDescription": "Small dog, golden retriever",
    "smoker": false,
    "leaseStartDate": "2025-09-01T00:00:00",
    "leaseEndDate": "2026-08-31T00:00:00",
    "moveInDate": "2025-09-01T00:00:00",
    "isActive": true,
    "emailVerified": false,
    "unit": {
      "id": 1,
      "unitNumber": "101",
      "building": {
        "id": 1,
        "name": "Sunset Apartments"
      }
    }
  }
]
```

#### GET `/api/tenants/building/{buildingId}` 🔒 OWNER
Get all tenants for a specific building.

**Response (200 OK):** Array of tenants for the building.
**Response (400 Bad Request):** Building not found or not owned by user.

#### GET `/api/tenants/{id}` 🔒 OWNER/TENANT
Get tenant details (owner can view any tenant in their buildings, tenant can only view self).

**Response (200 OK):** Single tenant object.
**Response (403 Forbidden):** Access denied.
**Response (404 Not Found):** Tenant not found.

#### GET `/api/tenants/profile` 🔒 TENANT
Get current tenant's profile.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response (200 OK):** Current tenant's full profile object.
**Response (404 Not Found):** Tenant profile not found.

#### PUT `/api/tenants/{id}` 🔒 TENANT
Update tenant information (tenant can only update own profile).

**Request Body:** Partial tenant object with updatable fields:
```json
{
  "dateOfBirth": "1990-05-15T00:00:00",
  "employer": "New Tech Corp",
  "jobTitle": "Senior Software Engineer",
  "monthlyIncome": 6000.00,
  "emergencyContactName": "Jane Smith",
  "emergencyContactPhone": "+1987654321",
  "numberOfOccupants": 1,
  "hasPets": false,
  "petDescription": null,
  "smoker": false
}
```

**Note:** Cannot update email, password, lease dates, or unit assignment.

**Response (200 OK):** Returns updated tenant object.

---

### Issue Management (`/api/issues`)

#### POST `/api/issues` 🔒 TENANT
Submit a new maintenance issue.

**Headers:** `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "title": "Broken Kitchen Faucet",
  "description": "The kitchen faucet is leaking continuously and won't shut off completely",
  "category": "PLUMBING",
  "priority": "HIGH",
  "locationInUnit": "Kitchen sink area"
}
```

**Required Fields:**
- `title`: String, max 200 chars, not blank
- `description`: String, max 5000 chars, not blank
- `category`: Enum (required) - Available values:
  - `PLUMBING`, `ELECTRICAL`, `HEATING_COOLING`, `APPLIANCES`, `PEST_CONTROL`
  - `STRUCTURAL`, `SAFETY_SECURITY`, `CLEANING`, `NOISE_COMPLAINT`, `WATER_DAMAGE`
  - `LOCKS_KEYS`, `WINDOWS_DOORS`, `LIGHTING`, `INTERNET_CABLE`, `PARKING`
  - `GARBAGE_RECYCLING`, `LANDSCAPING`, `OTHER`
- `priority`: Enum (required) - Available values:
  - `LOW`, `MEDIUM`, `HIGH`, `URGENT`, `EMERGENCY`

**Optional Fields:**
- `locationInUnit`: String, max 255 chars

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Broken Kitchen Faucet",
  "description": "The kitchen faucet is leaking continuously and won't shut off completely",
  "category": "PLUMBING",
  "priority": "HIGH",
  "status": "OPEN",
  "locationInUnit": "Kitchen sink area",
  "createdAt": "2025-08-11T10:00:00",
  "updatedAt": null,
  "resolvedAt": null,
  "adminNotes": null,
  "tenant": {
    "id": 2,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com"
  },
  "unit": {
    "id": 1,
    "unitNumber": "101",
    "building": {
      "id": 1,
      "name": "Sunset Apartments"
    }
  },
  "assignedTo": null
}
```

#### GET `/api/issues/my-issues` 🔒 TENANT
Get all issues submitted by the current tenant.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response (200 OK):** Array of issues ordered by creation date (newest first).

#### GET `/api/issues/owner-issues` 🔒 OWNER
Get all issues for the owner's properties.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response (200 OK):** Array of all issues across owner's buildings.

#### GET `/api/issues/building/{buildingId}` 🔒 OWNER
Get all issues for a specific building.

**Response (200 OK):** Array of issues for the building.
**Response (400 Bad Request):** Building not found or not owned by user.

#### GET `/api/issues/{id}` 🔒 OWNER/TENANT
Get specific issue details (owner can view all issues in their properties, tenant can only view own issues).

**Response (200 OK):** Single issue object.
**Response (403 Forbidden):** Access denied.
**Response (404 Not Found):** Issue not found.

#### PUT `/api/issues/{id}/status` 🔒 OWNER
Update issue status and add admin notes.

**Query Parameters:**
- `status` (required): One of: `OPEN`, `IN_PROGRESS`, `PENDING_PARTS`, `PENDING_APPROVAL`, `SCHEDULED`, `RESOLVED`, `CLOSED`, `CANCELLED`, `DUPLICATE`
- `adminNotes` (optional): String with admin notes

**Example:**
```
PUT /api/issues/1/status?status=IN_PROGRESS&adminNotes=Maintenance team assigned, parts ordered
```

**Response (200 OK):** Returns updated issue with new status and timestamp.

**Note:** Setting status to `RESOLVED` or `CLOSED` automatically sets `resolvedAt` timestamp.

#### PUT `/api/issues/{id}/assign` 🔒 OWNER
Assign issue to a user (maintenance staff, etc.).

**Query Parameters:**
- `assignedToId` (required): User ID to assign issue to

**Example:**
```
PUT /api/issues/1/assign?assignedToId=5
```

**Response (200 OK):** Returns updated issue with assigned user and status changed to `IN_PROGRESS`.

#### PUT `/api/issues/{id}` 🔒 TENANT
Update issue details (only allowed if issue status is `OPEN`).

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description with more details",
  "category": "PLUMBING",
  "priority": "URGENT",
  "locationInUnit": "Updated location"
}
```

**Response (200 OK):** Returns updated issue.
**Response (400 Bad Request):** Issue no longer editable (status not OPEN).
**Response (403 Forbidden):** Not issue owner.

#### GET `/api/issues/status/{status}` 🔒 OWNER
Get issues by status for owner's properties.

**Available status values:** `OPEN`, `IN_PROGRESS`, `PENDING_PARTS`, `PENDING_APPROVAL`, `SCHEDULED`, `RESOLVED`, `CLOSED`, `CANCELLED`, `DUPLICATE`

**Response (200 OK):** Array of issues with specified status.

#### GET `/api/issues/urgent` 🔒 OWNER
Get emergency and urgent issues for owner's properties.

**Response (200 OK):** Array of issues with priority `URGENT` or `EMERGENCY`.
- **OWNER**: Get all issues for their properties
- **TENANT**: Get their own issues

#### GET `/api/issues/building/{buildingId}` 🔒 OWNER
Get issues for a specific building.

#### PUT `/api/issues/{id}` 🔒 OWNER
Update issue status, assignment, etc.

#### PUT `/api/issues/{id}/assign` 🔒 OWNER
Assign issue to a user.

**Request Body:**
```json
{
  "assignedToId": 5
}
```

---

### Payment Management (`/api/payments`)

#### POST `/api/payments` 🔒 TENANT
Create a payment (Stripe integration).

**Request Body:**
```json
{
  "amount": 2500.00,
  "paymentType": "RENT",
  "description": "Monthly rent for Unit 101",
  "stripePaymentMethodId": "pm_1234567890"
}
```

#### GET `/api/payments` 🔒 OWNER/TENANT
- **OWNER**: All payments for their properties
- **TENANT**: Their own payments

#### GET `/api/payments/tenant/{tenantId}` 🔒 OWNER
Get payments for a specific tenant.

#### PUT `/api/payments/{id}/status` 🔒 OWNER
Update payment status manually.

---

### Dashboard APIs (`/api/dashboard`)

#### GET `/api/dashboard/owner` 🔒 OWNER
Get owner dashboard summary.

**Response:**
```json
{
  "totalBuildings": 3,
  "totalUnits": 45,
  "occupiedUnits": 38,
  "availableUnits": 7,
  "totalTenants": 38,
  "openIssues": 12,
  "totalRevenue": 95000.00,
  "monthlyRevenue": 95000.00,
  "recentIssues": [...],
  "recentPayments": [...]
}
```

#### GET `/api/dashboard/tenant` 🔒 TENANT
Get tenant dashboard summary.

**Response:**
```json
{
  "unit": {...},
  "upcomingRent": {...},
  "recentPayments": [...],
  "openIssues": [...],
  "announcements": [...]
}
```

#### GET `/api/dashboard/building/{buildingId}` 🔒 OWNER
Get building-specific dashboard.

---

## Models & Entities

### Enums

#### Role
```java
public enum Role {
    OWNER, TENANT
}
```

#### BackgroundCheckStatus
```java
public enum BackgroundCheckStatus {
    PENDING, APPROVED, REJECTED, NOT_REQUIRED
}
```

#### UnitType
```java
public enum UnitType {
    STUDIO, ONE_BEDROOM, TWO_BEDROOM, THREE_BEDROOM, PENTHOUSE
}
```

#### IssueCategory
```java
public enum IssueCategory {
    PLUMBING, ELECTRICAL, HEATING_COOLING, APPLIANCE, MAINTENANCE, SECURITY, OTHER
}
```

#### IssuePriority
```java
public enum IssuePriority {
    LOW, MEDIUM, URGENT, EMERGENCY
}
```

#### IssueStatus
```java
public enum IssueStatus {
    OPEN, IN_PROGRESS, RESOLVED, CLOSED
}
```

#### PaymentType
```java
public enum PaymentType {
    RENT, SECURITY_DEPOSIT, LATE_FEE, UTILITY, OTHER
}
```

#### PaymentMethod
```java
public enum PaymentMethod {
    CREDIT_CARD, BANK_TRANSFER, CHECK, CASH, STRIPE
}
```

#### PaymentStatus
```java
public enum PaymentStatus {
    PENDING, COMPLETED, FAILED, REFUNDED
}
```

---

## Configuration

### Application Properties
```properties
# Application Configuration
spring.application.name=Colten
server.port=8080

# Database Configuration (H2 for development)
spring.datasource.url=jdbc:h2:mem:coltendb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
app.jwt.secret=ColtenSecretKey2025ForTenantManagementAppWithMoreSecurity
app.jwt.expiration=86400000

# Stripe Configuration
stripe.api.key=${STRIPE_SECRET_KEY:sk_test_your_test_key_here}
stripe.publishable.key=${STRIPE_PUBLISHABLE_KEY:pk_test_your_test_key_here}

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${EMAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${EMAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS Configuration
app.cors.allowed-origins=http://localhost:3000,http://localhost:5173

# Logging
logging.level.com.example.Colten=DEBUG
logging.level.org.springframework.security=DEBUG

# JSON Serialization
# Fixed circular references with @JsonIgnore annotations on entity relationships
spring.jackson.serialization.fail-on-empty-beans=false
```

---

## Development Setup

### Prerequisites
- Java 24
- Maven 3.9+
- Node.js 20+ (for frontend)

### Running the Backend
```bash
# Clone and navigate to project
cd Colten

# Run with Maven wrapper
./mvnw spring-boot:run

# Or on Windows
.\mvnw spring-boot:run

# Application starts on http://localhost:8080
```

### Database Access
- **H2 Console**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:coltendb`
- **Username**: `sa`
- **Password**: `password`

### API Testing
Use tools like Postman, Insomnia, or curl to test endpoints:

```bash
# Register an owner
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "owner@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890",
    "companyName": "Test Properties"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "password123"
  }'
```

---

## Testing

### Test Accounts for Development

#### Owner Account
- **Email**: owner@example.com
- **Password**: password123
- **Role**: OWNER

#### Tenant Account (after registering with room code)
- **Email**: tenant@example.com
- **Password**: password123
- **Role**: TENANT

### Testing Workflow
1. Register an owner account
2. Create a building
3. Create units with room codes
4. Register tenant using room code
5. Test issue creation
6. Test payment processing (requires Stripe keys)

---

## Deployment Notes

### Production Configuration
1. **Database**: Replace H2 with PostgreSQL/MySQL
2. **JWT Secret**: Use environment variable
3. **Stripe Keys**: Set production keys
4. **Email**: Configure SMTP settings
5. **CORS**: Restrict to production domain
6. **Logging**: Adjust log levels

### Environment Variables for Production
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-password
JWT_SECRET=your-production-secret
DATABASE_URL=jdbc:postgresql://localhost:5432/colten
DATABASE_USERNAME=colten_user
DATABASE_PASSWORD=secure_password
```

### Security Considerations
- Change JWT secret in production
- Use HTTPS in production
- Implement rate limiting
- Add input validation and sanitization
- Regular security audits
- Monitor authentication attempts

---

## API Rate Limiting & Error Handling

### Standard HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "timestamp": "2025-08-05T19:30:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/signup"
}
```

---

## Integration Points for Frontend

### Required Frontend Libraries
- **HTTP Client**: axios or fetch
- **State Management**: React Context or Redux
- **Routing**: React Router
- **UI Components**: Material-UI, Ant Design, or custom
- **Forms**: Formik or React Hook Form
- **Date Handling**: date-fns or moment.js

### Key Integration Points
1. **Authentication Flow**: Login → Store JWT → Include in headers
2. **Role-based Routing**: Different dashboards for Owner/Tenant
3. **Real-time Updates**: Consider WebSocket for issue updates
4. **File Uploads**: For future attachment features
5. **Payment Integration**: Stripe Elements for secure payments

### Recommended Frontend Structure
```
src/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── buildings/
│   ├── units/
│   ├── tenants/
│   ├── issues/
│   └── payments/
├── services/
│   ├── api.js
│   ├── auth.js
│   └── stripe.js
├── hooks/
├── context/
├── utils/
└── types/
```

---

**Last Updated**: August 5, 2025  
**Backend Version**: 1.0.0  
**Spring Boot Version**: 3.5.4  
**Java Version**: 24

---

This documentation serves as a complete reference for integrating with the Colten backend API. All endpoints are tested and operational as of the last update.
