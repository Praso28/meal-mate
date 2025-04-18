import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Public pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Layout
const AppLayout = React.lazy(() => import('./components/layout/AppLayout'));

// Dashboard pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));

// Donor pages
const DonationsList = React.lazy(() => import('./pages/donor/DonationsList'));
const CreateDonation = React.lazy(() => import('./pages/donor/CreateDonation'));
const EditDonation = React.lazy(() => import('./pages/donor/EditDonation'));

// Volunteer pages
const AssignmentsList = React.lazy(() => import('./pages/volunteer/AssignmentsList'));
const AvailableDonations = React.lazy(() => import('./pages/volunteer/AvailableDonations'));

// Foodbank pages
const Inventory = React.lazy(() => import('./pages/foodbank/Inventory'));
const IncomingDonations = React.lazy(() => import('./pages/foodbank/IncomingDonations'));
const Reports = React.lazy(() => import('./pages/foodbank/Reports'));

// Admin pages
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminDonations = React.lazy(() => import('./pages/admin/Donations'));
const AdminReports = React.lazy(() => import('./pages/admin/Reports'));
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'));
const DonationDetail = React.lazy(() => import('./pages/admin/DonationDetail'));
const AssignDonation = React.lazy(() => import('./pages/admin/AssignDonation'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              {/* Common routes */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />

              {/* Donor routes */}
              <Route path="donations" element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonationsList />
                </ProtectedRoute>
              } />
              <Route path="donations/new" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <CreateDonation />
                </ProtectedRoute>
              } />
              <Route path="donations/:id/edit" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <EditDonation />
                </ProtectedRoute>
              } />

              {/* Volunteer routes */}
              <Route path="assignments" element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <AssignmentsList />
                </ProtectedRoute>
              } />
              <Route path="available-donations" element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <AvailableDonations />
                </ProtectedRoute>
              } />

              {/* Foodbank routes */}
              <Route path="inventory" element={
                <ProtectedRoute allowedRoles={['foodbank']}>
                  <Inventory />
                </ProtectedRoute>
              } />
              <Route path="incoming-donations" element={
                <ProtectedRoute allowedRoles={['foodbank']}>
                  <IncomingDonations />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute allowedRoles={['foodbank']}>
                  <Reports />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="admin/donations" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDonations />
                </ProtectedRoute>
              } />
              <Route path="admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              <Route path="donations/:id" element={
                <ProtectedRoute allowedRoles={['admin', 'donor', 'volunteer', 'foodbank']}>
                  <DonationDetail />
                </ProtectedRoute>
              } />
              <Route path="admin/donations/:id/assign" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AssignDonation />
                </ProtectedRoute>
              } />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </NotificationProvider>
    </Router>
  );
};

export default App;