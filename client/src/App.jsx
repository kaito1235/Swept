import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { HostDashboard } from './pages/dashboard/HostDashboard';
import { CleanerDashboard } from './pages/dashboard/CleanerDashboard';
import { SearchPage } from './pages/SearchPage';
import { CleanerProfilePage } from './pages/CleanerProfilePage';
import { EditProfilePage } from './pages/cleaner/EditProfilePage';
import { CleanerBookingsPage } from './pages/cleaner/CleanerBookingsPage';
import { PropertiesPage } from './pages/host/PropertiesPage';
import { BookingRequestPage } from './pages/host/BookingRequestPage';
import { HostBookingsPage } from './pages/host/HostBookingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#0D9488', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={
              <GuestRoute><LoginPage /></GuestRoute>
            } />
            <Route path="/register" element={
              <GuestRoute><RegisterPage /></GuestRoute>
            } />

            <Route path="/select-role" element={
              <ProtectedRoute><RoleSelectionPage /></ProtectedRoute>
            } />

            <Route path="/dashboard/host" element={
              <ProtectedRoute requiredRole="host"><HostDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/cleaner" element={
              <ProtectedRoute requiredRole="cleaner"><CleanerDashboard /></ProtectedRoute>
            } />

            <Route path="/search" element={<SearchPage />} />
            <Route path="/cleaners/:id" element={<CleanerProfilePage />} />

            <Route path="/cleaner/profile/edit" element={
              <ProtectedRoute requiredRole="cleaner"><EditProfilePage /></ProtectedRoute>
            } />
            <Route path="/cleaner/bookings" element={
              <ProtectedRoute requiredRole="cleaner"><CleanerBookingsPage /></ProtectedRoute>
            } />

            <Route path="/properties" element={
              <ProtectedRoute requiredRole="host"><PropertiesPage /></ProtectedRoute>
            } />
            <Route path="/book/:cleanerId" element={
              <ProtectedRoute requiredRole="host"><BookingRequestPage /></ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute requiredRole="host"><HostBookingsPage /></ProtectedRoute>
            } />

            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
