# Message to Next Session - Frontend Development Guide

## � **System Overview - What You're Building**

**Colten** is a comprehensive tenant management platform that connects property owners with their tenants through a modern web application. Think of it as "Airbnb meets property management" - but for long-term rentals with full lifecycle management.

### **The Business Problem We're Solving**
Traditional property management involves:
- Manual tenant screening and onboarding
- Paper-based maintenance requests
- Scattered payment collection methods
- Poor communication between owners and tenants
- No centralized dashboard for property oversight

### **Our Solution - Two-Sided Platform**

#### **👨‍💼 Owner Experience**
**Property owners** use Colten to:
1. **Manage Multiple Buildings**: Add properties with full address details
2. **Create & Configure Units**: Set up apartments with amenities, pricing, lease terms
3. **Generate Room Codes**: Unique 8-character codes for secure tenant access
4. **Tenant Onboarding**: Review applications, approve background checks
5. **Issue Management**: Track maintenance requests, assign repairs, monitor resolution
6. **Payment Oversight**: Monitor rent collection, late fees, payment history
7. **Analytics Dashboard**: Revenue tracking, occupancy rates, issue trends

#### **🏠 Tenant Experience**
**Tenants** use Colten to:
1. **Easy Registration**: Join using room code provided by property owner
2. **Digital Lease Management**: View lease terms, unit details, amenities
3. **Maintenance Requests**: Submit issues with photos, track repair status
4. **Rent Payments**: Pay monthly rent securely via Stripe integration
5. **Communication Hub**: Direct line to property management
6. **Personal Dashboard**: Payment history, upcoming due dates, announcements

### **Key Differentiators**
- **Room Code System**: Secure, unique access prevents unauthorized applications
- **Role-Based Security**: Owners see everything, tenants see only their data
- **Integrated Payments**: Built-in Stripe processing, no third-party redirects
- **Real-Time Issue Tracking**: Maintenance requests with status updates
- **Mobile-First Design**: Responsive interface for on-the-go management

### **User Journey Examples**

#### **New Property Owner Onboarding**
1. Register account with company details
2. Add first building (address, number of units)
3. Create units with room codes, pricing, amenities
4. Share room codes with prospective tenants
5. Review tenant applications and approve
6. Begin receiving rent payments and managing issues

#### **New Tenant Onboarding**
1. Receive room code from property owner
2. Register account using room code (validates unit access)
3. Complete tenant profile with emergency contacts, employment
4. View unit details and lease information
5. Set up payment method for monthly rent
6. Begin submitting maintenance requests as needed

### **Technical Architecture Vision**
- **Frontend**: Modern React TypeScript SPA with responsive design
- **Backend**: Spring Boot REST API with JWT authentication
- **Database**: Relational data model with proper entity relationships
- **Payments**: Stripe integration for secure payment processing
- **Security**: Role-based access control with token-based auth
- **Deployment**: Cloud-ready architecture with environment configs

## �🎯 **Context Summary**
You are continuing the Colten Tenant Management System frontend development. The backend is **100% complete and operational** at `http://localhost:8080`. All 45 Java classes are working perfectly with comprehensive API endpoints.

## ✅ **What's Already Done**
- **Backend**: Spring Boot 3.5.4 with Java 24 - Fully operational
- **Authentication**: JWT-based auth with Owner/Tenant roles
- **API Endpoints**: 7 controllers with full CRUD operations
- **Database**: H2 with complete entity relationships
- **Security**: CORS configured for localhost:3000
- **Payment**: Stripe integration ready
- **Documentation**: Complete API reference in `BACKEND_DOCUMENTATION.md`

## 🚀 **Your Mission - Frontend Development**
Build a React TypeScript frontend that integrates with the backend APIs. Work step-by-step and let the user test each component before moving to the next.

## 📋 **Step-by-Step Development Plan**

### **Phase 1: Authentication Foundation**
1. **Login Component** - Connect to `/api/auth/login`
2. **Register Component** - Connect to `/api/auth/register` 
3. **Auth Context** - JWT token management
4. **Protected Routes** - Role-based routing (Owner/Tenant)

### **Phase 2: Owner Dashboard**
1. **Owner Dashboard** - Connect to `/api/dashboard/owner`
2. **Building Management** - CRUD operations via `/api/buildings`
3. **Unit Management** - CRUD with room code generation via `/api/units`
4. **Tenant Management** - View/manage tenants via `/api/tenants`

### **Phase 3: Tenant Experience**
1. **Tenant Registration** - Room code signup via `/api/tenants/register`
2. **Tenant Dashboard** - Connect to `/api/dashboard/tenant`
3. **Issue Reporting** - Submit maintenance requests via `/api/issues`
4. **Payment Portal** - Stripe integration via `/api/payments`

### **Phase 4: Advanced Features**
1. **Real-time Updates** - Issue status tracking
2. **Payment History** - Transaction management
3. **Building Analytics** - Owner reporting
4. **Mobile Responsiveness** - Cross-device compatibility

## 🛠️ **Technical Guidelines**

### **Required Dependencies**
```bash
# Install these first
npm install axios react-router-dom
npm install @types/node @types/react @types/react-dom
npm install @stripe/stripe-js @stripe/react-stripe-js  # For payments
```

### **Project Structure to Create**
```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── TenantRegister.tsx
│   ├── dashboard/
│   │   ├── OwnerDashboard.tsx
│   │   └── TenantDashboard.tsx
│   ├── buildings/
│   ├── units/
│   ├── issues/
│   └── payments/
├── context/
│   └── AuthContext.tsx
├── services/
│   ├── api.ts
│   └── auth.ts
├── types/
│   └── api.ts
└── utils/
    └── constants.ts
```

### **API Integration Pattern**
```typescript
// Always use this pattern
const API_BASE_URL = 'http://localhost:8080/api';

// Include JWT token in headers
const token = localStorage.getItem('token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## 🔑 **Critical Success Factors**

### **1. Authentication Flow**
- Store JWT token in localStorage
- Include `Authorization: Bearer <token>` in all protected requests
- Handle token expiration (24-hour expiry)
- Redirect based on role (Owner → Owner Dashboard, Tenant → Tenant Dashboard)

### **2. Role-Based Access**
- **Owner**: Access to buildings, units, tenants, all issues, all payments
- **Tenant**: Access to their unit, their issues, their payments only

### **3. API Error Handling**
- Handle 401 (unauthorized) → redirect to login
- Handle 403 (forbidden) → show access denied
- Handle 400 (validation) → show field errors
- Handle 500 (server) → show friendly error message

### **4. Test Workflow**
1. Start with owner registration/login
2. Create a building
3. Create units (room codes auto-generated)
4. Test tenant registration with room code
5. Test issue creation and payment flows

## � **FIXED - Authentication Working!**

✅ **Both endpoints are now working perfectly:**
- **Registration**: `POST /api/auth/register` - Returns JWT token
- **Login**: `POST /api/auth/login` - Returns JWT token

### **Working API Examples (Tested & Verified)**

#### **Register Owner Request:**
```json
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "Owner", 
  "email": "test@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "OWNER",
  "companyName": "Test Company"
}
```

#### **Login Request:**
```json
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### **Success Response (Both endpoints):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "Owner",
  "role": ["ROLE_OWNER"]
}
```

## �📚 **Key API Endpoints to Integrate**

### **Authentication** (`/api/auth`)
- `POST /login` - Login (WORKING ✅)
- `POST /register` - Owner registration (WORKING ✅)

### **Buildings** (`/api/buildings`) 🔒 OWNER
- `GET /` - List owner's buildings
- `POST /` - Create building
- `PUT /{id}` - Update building
- `DELETE /{id}` - Delete building

### **Units** (`/api/units`)
- `GET /` - List owner's units 🔒 OWNER
- `GET /building/{id}/available` - Public unit listing
- `POST /` - Create unit 🔒 OWNER
- `POST /{id}/regenerate-room-code` - New room code 🔒 OWNER

### **Tenants** (`/api/tenants`)
- `POST /register` - Tenant registration with room code
- `GET /` - List tenants 🔒 OWNER

### **Issues** (`/api/issues`) 🔒 OWNER/TENANT
- `GET /` - List issues (filtered by role)
- `POST /` - Create issue (tenant)
- `PUT /{id}` - Update issue (owner)

### **Payments** (`/api/payments`) 🔒 OWNER/TENANT
- `GET /` - List payments (filtered by role)
- `POST /` - Create payment (tenant, Stripe)

### **Dashboard** (`/api/dashboard`)
- `GET /owner` - Owner analytics 🔒 OWNER
- `GET /tenant` - Tenant summary 🔒 TENANT

## 🎨 **UI/UX Recommendations**
- Use modern, clean design (consider Material-UI or Tailwind CSS)
- Mobile-first responsive design
- Clear navigation between Owner/Tenant sections
- Loading states for all API calls
- Success/error notifications
- Form validation with helpful error messages

## 🧪 **Testing Strategy**
- Test each component individually before moving to next
- Use browser dev tools to verify API calls
- Test both Owner and Tenant user flows
- Verify authentication redirects work correctly
- Test error scenarios (network failures, invalid data)

## 💡 **Pro Tips**
- The backend documentation is complete and accurate - reference it frequently
- All API endpoints are tested and working perfectly
- CORS is configured for localhost:3000
- JWT tokens expire in 24 hours
- Room codes are 8-character alphanumeric strings
- The user prefers step-by-step development with testing at each phase

## 🚦 **Getting Started**
1. Verify React dev server is running on localhost:3000
2. Verify backend is running on localhost:8080
3. Start with the Login component
4. Test API connectivity with a simple login call
5. Build incrementally and test thoroughly

---

**Remember**: The user wants to test and approve each step before moving forward. Build confidence through working increments rather than trying to do everything at once.

**Backend Status**: ✅ 100% Complete and Operational
**Frontend Status**: 🚧 Ready for Development
**Your Role**: Frontend Development Lead

Good luck! The foundation is solid - now build an amazing user experience on top of it! 🚀
