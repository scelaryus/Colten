# Colten - Tenant Management System

> A comprehensive property management platform connecting property owners with tenants through modern web technology.

## 🏢 Project Overview

**Colten** is a full-stack tenant management system that streamlines property management through a modern, secure, and user-friendly platform. The system facilitates seamless communication between property owners and tenants while providing powerful tools for building management, maintenance tracking, and payment processing.

### Key Features

- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **🏘️ Building Management**: Complete CRUD operations for buildings and units
- **🔑 Room Code System**: Unique 8-character codes for secure tenant onboarding
- **🛠️ Issue Tracking**: Comprehensive maintenance request management
- **💳 Payment Processing**: Integrated Stripe payment system
- **📊 Analytics Dashboard**: Real-time insights for owners and tenants
- **📱 Responsive Design**: Mobile-first, cross-device compatibility

### User Types

#### Property Owners
- Manage multiple buildings and units
- Generate room codes for tenant access
- Track maintenance issues and resolutions
- Monitor rent collection and payment history
- Access comprehensive analytics and reporting

#### Tenants
- Register using provided room codes
- Submit and track maintenance requests
- Pay rent securely through Stripe integration
- View unit details and lease information
- Access personal dashboard with payment history

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 24
- **Database**: H2 (development) / PostgreSQL (production)
- **Security**: Spring Security 6.x with JWT
- **Payment**: Stripe API integration
- **Build Tool**: Maven
- **Server**: Embedded Tomcat (port 8080)

### Frontend
- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11
- **HTTP Client**: Axios 1.11.0
- **Routing**: React Router DOM 7.7.1
- **Payment**: Stripe React Components

## 🚀 Quick Start

### Prerequisites

- **Java 24** or higher
- **Node.js 20+** and npm
- **Maven 3.9+**
- **Git**

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run the Spring Boot application**
   ```bash
   # Using Maven wrapper (recommended)
   ./mvnw spring-boot:run
   
   # On Windows
   .\mvnw spring-boot:run
   ```

3. **Verify backend is running**
   - API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console
     - JDBC URL: `jdbc:h2:mem:coltendb`
     - Username: `sa`
     - Password: `password`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 📖 API Documentation

### Authentication Endpoints

#### Register Owner
```http
POST /api/auth/register
Content-Type: application/json

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

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "owner@example.com",
  "password": "password123"
}
```

### Core API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/buildings` | GET | Owner | List all buildings |
| `/api/buildings` | POST | Owner | Create new building |
| `/api/units` | GET | Owner | List all units |
| `/api/units` | POST | Owner | Create new unit |
| `/api/tenants/register` | POST | Public | Tenant registration |
| `/api/tenants/validate-room-code` | POST | Public | Validate room code |
| `/api/issues` | GET/POST | Owner/Tenant | Issue management |
| `/api/payments` | GET/POST | Owner/Tenant | Payment processing |
| `/api/dashboard/owner` | GET | Owner | Owner dashboard |
| `/api/dashboard/tenant` | GET | Tenant | Tenant dashboard |

## 🔧 Development

### Backend Development

The backend follows standard Spring Boot conventions:

```
backend/src/main/java/com/example/Colten/
├── controller/          # REST API controllers
├── model/              # JPA entities
├── repository/         # Data access layer
├── service/            # Business logic
├── security/           # JWT and security config
├── dto/               # Data transfer objects
└── config/            # Spring configuration
```

### Frontend Development

The frontend is built with modern React patterns:

```
frontend/src/
├── components/         # React components
├── services/          # API service layer
├── hooks/            # Custom React hooks
├── context/          # React context providers
├── types/           # TypeScript type definitions
└── utils/          # Utility functions
```

### Database Schema

Key entities and relationships:

- **User** (Abstract base)
  - **Owner** → Buildings → Units → Tenant
  - **Tenant** → Unit → Issues/Payments
- **Building** → Multiple Units
- **Unit** → Single Tenant + Issues + Payments
- **Issue** → Tenant + Unit + Status tracking
- **Payment** → Tenant + Unit + Stripe integration

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm run lint
npm run build
```

### Manual Testing Workflow

1. **Register as Owner**
   - Create account with company details
   - Verify JWT token generation

2. **Create Building & Units**
   - Add building with address details
   - Create units with room codes
   - Verify room code generation

3. **Tenant Registration**
   - Use room code to register tenant
   - Verify unit assignment

4. **Issue & Payment Flow**
   - Submit maintenance request
   - Process payment through Stripe

## 🚀 Deployment

### Environment Variables

```bash
# Database (Production)
DATABASE_URL=jdbc:postgresql://localhost:5432/colten
DATABASE_USERNAME=colten_user
DATABASE_PASSWORD=secure_password

# JWT Configuration
JWT_SECRET=your-production-secret-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email Configuration
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-password
```

### Production Deployment

1. **Backend**
   ```bash
   cd backend
   ./mvnw clean package
   java -jar target/Colten-0.0.1-SNAPSHOT.jar
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   # Deploy dist/ folder to your web server
   ```

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Role-Based Access**: Owner/Tenant permission separation
- **Password Security**: BCrypt encryption with strength 12
- **API Protection**: All endpoints properly secured
- **CORS Configuration**: Restricted to allowed origins
- **Input Validation**: Comprehensive request validation

## 🌟 Key Differentiators

- **Room Code System**: Secure tenant onboarding without email invites
- **Integrated Payments**: Built-in Stripe processing
- **Real-time Updates**: WebSocket support for live notifications
- **Mobile-First**: Responsive design for all devices
- **Role Separation**: Clear boundaries between owner and tenant access

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@colten.com or create an issue in this repository.

---

**Built with ❤️ for modern property management**

*Last Updated: January 2025*