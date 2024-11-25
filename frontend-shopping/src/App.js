import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import Cart from './pages/cart/Cart';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import VerifyPage from './pages/VerifyPage';
import AboutUs from './pages/AboutUs';
import { useAuth } from './Context/authStore';
import { useEffect } from 'react';
import PrivateRoute from './utils/PrivateRoutes';
import LoadingSpinner from './components/LoadingSpinner';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ContactUs from './pages/ContactUs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail'
import OrdersPage from './pages/Orderspage';
import ProfilePage from './pages/ProfilePage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';


const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // If the user is authenticated and verified, redirect to the homepage
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the requested page (login or signup)
  return children;
};

function App() {
  const { checkAuth, isCheckingAuth } = useAuth();
  const location = useLocation();  // Use location hook to track path changes

  useEffect(() => {
    checkAuth();
  }, []);

  // Main content styling with reduced opacity or blur when checking auth
  const mainContentStyle = isCheckingAuth ? { opacity: 0.5, pointerEvents: 'none' } : {};

  // Check if the current path starts with '/reset-password' (to handle dynamic token)
  const hideNavbar = location.pathname.startsWith('/reset-password') || location.pathname === '/forgot-password';

  return (
    <div className="App">
      {/* Conditionally render Navbar based on the current path */}
      {!hideNavbar && <Navbar />}
      {isCheckingAuth && <LoadingSpinner />}
      <div style={mainContentStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<VerifyPage />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
          </Route>
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
        </Routes>
        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
}

export default App;
