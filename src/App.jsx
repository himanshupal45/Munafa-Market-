import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Placeholder from './pages/Placeholder/Placeholder'
import SiteSetting from './pages/SiteSetting/SiteSetting'
import SetAmount from './pages/SetAmount/SetAmount'
import AppBanners from './pages/AppBanners/AppBanners'
import PaymentQR from './pages/PaymentQR/PaymentQR'
import AllUsers from "./pages/Users/AllUsers"
import UserProfile from './pages/Users/UserProfile/UserProfile'
import Roles from './pages/Users/Role/Roles'
import AssignRole from './pages/Users/AssignRole/AssignRole'
import WalletPoints from './pages/Wallet/WalletPoints/WalletPoints'
import AddPointRequest from './pages/Wallet/AddPointRequest/AddPointRequest'
import WithdrawRequest from './pages/Wallet/WithdrawRequest/WithdrawRequest'
import AllGames from './pages/Games/Allgames/AllGames'
import AddGame from './pages/Games/Allgames/AddGames/AddGames'
import GameBetReport from './pages/Games/GameBetReport/GameBetReport'
import GameResults from './pages/Games/GameResults/GameResults'
import AddResult from './pages/Games/GameResults/AddResult/AddResult'
import Notification from './pages/Notification/Notification'
import AddNotification from './pages/Notification/AddNotification/AddNotification'
import Enquiry from './pages/Enquiry/Enquiry'
import AboutUs from './pages/PolicyContent/AboutUs'
import PrivacyPolicy from './pages/PolicyContent/PrivacyPolicy'
import GameRules from './pages/PolicyContent/GameRules'
import Notes from './pages/PolicyContent/Notes'
import ComingSoon from './pages/ComingSoon/ComingSoon'
import UpdateProfile from './components/Header/UpdateProfile/UpdateProfile'
import Login from './components/Header/Login/Login'

// Auth check function
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root path - redirect based on auth */}
        <Route path="/" element={
          <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
        } />
        
        {/* Public routes - No authentication required */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* Protected routes - Authentication required */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/site-setting" element={
          <ProtectedRoute>
            <Layout>
              <SiteSetting />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/set-amount" element={
          <ProtectedRoute>
            <Layout>
              <SetAmount />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/app-banners" element={
          <ProtectedRoute>
            <Layout>
              <AppBanners />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/payment-qr" element={
          <ProtectedRoute>
            <Layout>
              <PaymentQR />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Users Routes */}
        <Route path="/users/all" element={
          <ProtectedRoute>
            <Layout>
              <AllUsers />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/users/assign-role" element={
          <ProtectedRoute>
            <Layout>
              <AssignRole />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/users/create-role" element={
          <ProtectedRoute>
            <Layout>
              <Roles />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/user-profile" element={
          <ProtectedRoute>
            <Layout>
              <UserProfile />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Wallet Routes */}
        <Route path="/wallet/Points" element={
          <ProtectedRoute>
            <Layout>
              <WalletPoints />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/wallet/AddWallet/points" element={
          <ProtectedRoute>
            <Layout>
              <AddPointRequest />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/wallet/withdrawals/Request" element={
          <ProtectedRoute>
            <Layout>
              <WithdrawRequest />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Games Routes */}
        <Route path="/games/all" element={
          <ProtectedRoute>
            <Layout>
              <AllGames />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/games/add" element={
          <ProtectedRoute>
            <Layout>
              <AddGame />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/games/bet/report" element={
          <ProtectedRoute>
            <Layout>
              <GameBetReport />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/games/results" element={
          <ProtectedRoute>
            <Layout>
              <GameResults />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/games/add-result" element={
          <ProtectedRoute>
            <Layout>
              <AddResult />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Notification Routes */}
        <Route path="/notification" element={
          <ProtectedRoute>
            <Layout>
              <Notification />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/add-notification" element={
          <ProtectedRoute>
            <Layout>
              <AddNotification />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Enquiry Route */}
        <Route path="/enquiry" element={
          <ProtectedRoute>
            <Layout>
              <Enquiry />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Policy & Content Routes */}
        <Route path="/policy-content/about" element={
          <ProtectedRoute>
            <Layout>
              <AboutUs />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/policy-content/privacy" element={
          <ProtectedRoute>
            <Layout>
              <PrivacyPolicy />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/policy-content/game-rules" element={
          <ProtectedRoute>
            <Layout>
              <GameRules />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/policy-content/notes" element={
          <ProtectedRoute>
            <Layout>
              <Notes />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Coming Soon Route */}
        <Route path="/coming-soon" element={
          <ProtectedRoute>
            <Layout>
              <ComingSoon />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Update Profile Route */}
        <Route path="/update-profile" element={
          <ProtectedRoute>
            <Layout>
              <UpdateProfile />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}