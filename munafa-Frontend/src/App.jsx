import React, { useLayoutEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import SiteSetting from "./pages/SiteSetting/SiteSetting";
import SetAmount from "./pages/SetAmount/SetAmount";
import AppBanners from "./pages/AppBanners/AppBanners";
import PaymentQR from "./pages/PaymentQR/PaymentQR";
import AllUsers from "./pages/Users/AllUsers";
import UserProfile from "./pages/Users/UserProfile/UserProfile";
import Roles from "./pages/Users/Role/Roles";
import AssignRole from "./pages/Users/AssignRole/AssignRole";
import WalletPoints from "./pages/Wallet/WalletPoints/WalletPoints";
import AddPointRequest from "./pages/Wallet/AddPointRequest/AddPointRequest";
import WithdrawRequest from "./pages/Wallet/WithdrawRequest/WithdrawRequest";
import AllGames from "./pages/Games/Allgames/AllGames";
import AddGame from "./pages/Games/Allgames/AddGames/AddGames";
import GameBetReport from "./pages/Games/GameBetReport/GameBetReport";
import GameResults from "./pages/Games/GameResults/GameResults";
import AddResult from "./pages/Games/GameResults/AddResult/AddResult";
import Notification from "./pages/Notification/Notification";
import AddNotification from "./pages/Notification/AddNotification/AddNotification";
import Enquiry from "./pages/Enquiry/Enquiry";
import AboutUs from "./pages/PolicyContent/AboutUs";
import PrivacyPolicy from "./pages/PolicyContent/PrivacyPolicy";
import GameRules from "./pages/PolicyContent/GameRules";
import Notes from "./pages/PolicyContent/Notes";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import UpdateProfile from "./components/Header/UpdateProfile/UpdateProfile";
import Login from "./components/Header/Login/Login";
import Register from "./components/Header/Login/Register";
import Placeholder from "./pages/Placeholder/Placeholder";
import LoginSplash from "./components/Header/Login/LoginSplash";
import GamesRate from "./pages/Games/GamesRate/AddGamesRate";
// ✅ Wallet Pages

// ✅ NEW IMPORTS
import WinnerPrediction from "./pages/WinnerPrediction/WinnerPrediction";
import ProfitLoss from "./pages/ProfitLoss/ProfitLoss";
import DeclareResult from "./pages/DeclareResult/DeclareResult";
import WinningDetails from "./pages/WinningDetails/WinningDetails";

// ✅ SETTINGS (single component, 3 URLs)
import PolicySetting from "./pages/PolicyContent/PolicySetting/PolicySetting";
import UPIVerification from "./pages/Wallet/UPIVerification/UPIVerification";
import QRUPIVerification from "./pages/Wallet/QRUPIVerification/QRUPIVerification";
import WithdrawPointsRequest from "./pages/Wallet/WithdrawRequest/WithdrawRequest";
import BidRevert from "./pages/Wallet/BidRevert/BidRevert";
import AllRefunds from "./pages/Wallet/AllRefunds/AllRefunds";


import SingleDigit from './pages/GamesNumbers/SingleDigit/SingleDigit'
import JodiDigit from './pages/GamesNumbers/JodiDigit/JodiDigit'
import SinglePana from './pages/GamesNumbers/SinglePana/SinglePana'
import DoublePana from './pages/GamesNumbers/DoublePana/DoublePana'
import TriplePana from './pages/GamesNumbers/TriplePana/TriplePana'
import HalfSangam from './pages/GamesNumbers/HalfSangam/HalfSangam'
import FullSangam from './pages/GamesNumbers/FullSangam/FullSangam'



import PersonalGameList from './pages/PersonalGames/GameList/GameList'
import GameList from "./pages/PersonalGames/GameList/GameList";
import GameRate from './pages/PersonalGames/GameRate/GameRate'
import BidHistory from './pages/PersonalGames/BidHistory/BidHistory'
import WinningReport from './pages/PersonalGames/WinningReport/WinningReport'

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

// ✅ PublicRoute
const PublicRoute = ({ children }) => {
  const { isAuthenticated, showLoginSplash } = useAuth();
  if (showLoginSplash) return children;
  if (isAuthenticated()) return <Navigate to="/admin" replace />;
  return children;
};

export default function App() {
  const { isAuthenticated, showLoginSplash } = useAuth();

  return (
    <BrowserRouter>
      <ScrollToTop />

      {showLoginSplash && <LoginSplash />}

      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated() ? "/admin" : "/login"} replace />
          }
        />

        {/* Public */}
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

        {/* Protected */}
        {[
          { path: "/admin", el: <Dashboard /> },
          { path: "/site-setting", el: <SiteSetting /> },
          { path: "/set-amount", el: <SetAmount /> },
          { path: "/app-banners", el: <AppBanners /> },
          { path: "/payment-qr", el: <PaymentQR /> },
          { path: "/users/all", el: <AllUsers /> },
          { path: "/users/assign-role", el: <AssignRole /> },
          { path: "/users/create-role", el: <Roles /> },
          { path: "/user-profile", el: <UserProfile /> },
          { path: "/wallet/Points", el: <WalletPoints /> },
          { path: "/wallet/AddWallet/points", el: <AddPointRequest /> },
          { path: "/wallet/withdrawals/Request", el: <WithdrawRequest /> },
          { path: "/games/all", el: <AllGames /> },
          { path: "/games/add", el: <AddGame /> },
          { path: "/games/bet/report", el: <GameBetReport /> },
          { path: "/games/results", el: <GameResults /> },
          { path: "/games/add-result", el: <AddResult /> },
          { path: "/games/rate", el: <GamesRate /> },
          { path: "/notification", el: <Notification /> },
          { path: "/add-notification", el: <AddNotification /> },
          { path: "/enquiry", el: <Enquiry /> },
          { path: "/policy-content/about", el: <AboutUs /> },
          { path: "/policy-content/privacy", el: <PrivacyPolicy /> },
          { path: "/policy-content/game-rules", el: <GameRules /> },
          { path: "/policy-content/notes", el: <Notes /> },
          { path: "/coming-soon", el: <ComingSoon /> },
          { path: "/update-profile", el: <UpdateProfile /> },

          // ✅ NEW ROUTES
          { path: "/winner-prediction", el: <WinnerPrediction /> },
          { path: "/profit-loss", el: <ProfitLoss /> },
          { path: "/declare-result", el: <DeclareResult /> },
          { path: "/winning-details", el: <WinningDetails /> },

          // ✅ SETTINGS — 3 URLs, same component
          { path: "/change-password", el: <PolicySetting /> },
          { path: "/contact-us", el: <PolicySetting /> },
          { path: "/how-to-play", el: <PolicySetting /> },
          { path: "/wallet/upi-verification", el: <UPIVerification /> },
          { path: "/wallet/qr-upi-verification", el: <QRUPIVerification /> },
          {
            path: "/wallet/withdraw-points-request",
            el: <WithdrawPointsRequest />,
          },
          { path: "/wallet/add-points", el: <WalletPoints /> },
          { path: "/wallet/bid-revert", el: <BidRevert /> },
          { path: "/wallet/all-refunds", el: <AllRefunds /> },

          { path: "/game-numbers/single_digits", el: <SingleDigit /> },
          { path: "/game-numbers/jodi_digits", el: <JodiDigit /> },
          { path: "/game-numbers/single_pana", el: <SinglePana /> },
          { path: "/game-numbers/double_pana", el: <DoublePana /> },
          { path: "/game-numbers/triple_pana", el: <TriplePana /> },
          { path: "/game-numbers/half_sangam", el: <HalfSangam /> },
          { path: "/game-numbers/full_sangam", el: <FullSangam /> },


          // Routes array mein add karo
          { path: '/get-disawar-game-list',                  el: <GameList/> },
          { path: '/personal-games/disawar/game-rate',       el: <GameRate /> },
          { path: '/personal-games/disawar/bid-history',     el: <BidHistory /> },
          { path: '/personal-games/disawar/declare-result',  el: <DeclareResult/> },
          { path: '/personal-games/disawar/winning-report',  el: <WinningReport /> },
        ].map(({ path, el }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Layout>{el}</Layout>
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
