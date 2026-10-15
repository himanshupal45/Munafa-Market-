import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Results from "./pages/Results/Results";
import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";
import HowToPlay from "./pages/HowToPlay/HowToPlay";
import RateChart from "./pages/RateChart/RateChart";
import SattaMatka from "./pages/SattaMatka/SattaMatka";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import MatkaResult from "./pages/Home/MatkaResult/MatkaResult";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import PanaChart from "./pages/PanaChart/PanaChart";
import PlayPage from "./pages/PlayPage/PlayPage";
import PlayOptionPage from "./pages/PlayOptionPage/PlayOptionPage";
import Withdraw from "./pages/Withdraw/Withdraw";
import AddPoints from "./pages/AddPoints/AddPoints";
import Wallet from "./pages/Wallet/Wallet";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import WalletHistory from "./pages/Wallet/WalletHistory/WalletHistory";
import Transfer from "./pages/Wallet/Transfer/Transfer";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) return <Navigate to="/User/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated()) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const Layout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="app-main">{children}</main>
    <Footer />
  </div>
);

const HomePage = () => (
  <>
    <Home />
    <MatkaResult />
  </>
);

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/User/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/how-to-play"
          element={
            <ProtectedRoute>
              <Layout>
                <HowToPlay />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rate-chart"
          element={
            <ProtectedRoute>
              <Layout>
                <RateChart />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/satta-matka"
          element={
            <ProtectedRoute>
              <Layout>
                <SattaMatka />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dp-boss"
          element={
            <ProtectedRoute>
              <Layout>
                <PrivacyPolicy />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Layout>
                <Results />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ Wallet Routes */}
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Layout>
                <Wallet />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Layout>
                <Withdraw />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-points"
          element={
            <ProtectedRoute>
              <Layout>
                <AddPoints />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet/history"
          element={
            <ProtectedRoute>
              <Layout>
                <WalletHistory/>
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/wallet/transfer"
          element={
            <ProtectedRoute>
              <Layout>
                <Transfer/>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Chart Routes */}
        <Route
          path="/pana-chart/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PanaChart />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jodi-chart/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PanaChart />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Play Routes */}
        <Route
          path="/play/:gameId"
          element={
            <ProtectedRoute>
              <Layout>
                <PlayPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/play/:gameId/:optionId"
          element={
            <ProtectedRoute>
              <Layout>
                <PlayOptionPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}