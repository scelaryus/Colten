import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './components/auth/Login';
import OwnerRegister from './components/auth/OwnerRegister';
import TenantRegister from './components/auth/TenantRegister';
import Dashboard from './components/Dashboard';
import { AppLayout } from './components/AppLayout';
import { UnitList, UnitForm, UnitDetail } from './components/units';
import { BuildingList, BuildingForm, BuildingDetail } from './components/buildings';
import { TenantList, TenantDetail, TenantProfile, MyUnit } from './components/tenants';
import { TenantPayments, OwnerPayments } from './components/payments';
import { TenantIssues, OwnerIssues } from './components/issues';
import TenantRegistrationTest from './components/TenantRegistrationTest';
import './App.css';

// Router components for role-based views
const PaymentRouter: React.FC = () => {
  const { isTenant } = useAuth();
  return isTenant() ? <TenantPayments /> : <OwnerPayments />;
};

const IssueRouter: React.FC = () => {
  const { isTenant } = useAuth();
  return isTenant() ? <TenantIssues /> : <OwnerIssues />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<OwnerRegister />} />
            <Route path="/tenant-register" element={<TenantRegister />} />
            <Route path="/test-tenant" element={<TenantRegistrationTest />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/buildings" 
              element={
                <ProtectedRoute requiredRole="OWNER">
                  <BuildingList />
                </ProtectedRoute>
              } 
            />
              <Route 
                path="/tenants" 
                element={
                  <ProtectedRoute requiredRole="OWNER">
                    <TenantList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tenants/:id" 
                element={
                  <ProtectedRoute requiredRole="OWNER">
                    <TenantDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requiredRole="TENANT">
                    <TenantProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-unit" 
                element={
                  <ProtectedRoute requiredRole="TENANT">
                    <MyUnit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payments" 
                element={
                  <ProtectedRoute>
                    {/* Show different payment views based on role */}
                    <PaymentRouter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/issues" 
                element={
                  <ProtectedRoute>
                    {/* Show different issue views based on role */}
                    <IssueRouter />
                  </ProtectedRoute>
                } 
              />
            <Route 
              path="/buildings/create" 
              element={
                <ProtectedRoute requiredRole="OWNER">
                  <BuildingForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/buildings/:id" 
              element={
                <ProtectedRoute requiredRole="OWNER">
                  <BuildingDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/buildings/:id/edit" 
              element={
                <ProtectedRoute requiredRole="OWNER">
                  <BuildingForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/units" 
              element={
                <ProtectedRoute requiredRole="OWNER">
                  <UnitList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/units/create" 
              element={
                <ProtectedRoute requiredRole="OWNER">
                  <UnitForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/units/:id" 
              element={
                <ProtectedRoute>
                  <UnitDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/units/:id/edit" 
              element={
                <ProtectedRoute requiredRole="OWNER">
                  <UnitForm />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
