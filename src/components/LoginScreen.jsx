import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline, IoLogoGithub } from "react-icons/io5";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../styles/LoginStyles.css';

import { getImagePath } from '../utils/imageUtils';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const login = async (loginData) => {
  const response = await api.post('/auth/login', loginData);
  console.log('Login Response:', response); // Debug line
  localStorage.setItem('authToken', response.data.token);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response;
};

const Login = ({ onLogin }) => {
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const query = useQuery();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = query.get('token');
    const refreshToken = query.get('refreshToken');

    if(token && refreshToken) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/homepage');
    }
  }, [query, navigate]);

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    const baseUrl = 'https://penguinman-backend-production.up.railway.app';
    const redirectUri = encodeURIComponent('https://savorspace.systems/homepage');
    const state = Math.random().toString(36).substring(7);
    
    localStorage.setItem('oauth_state', state);
    
    const googleAuthUrl = `${baseUrl}/oauth2/authorization/google?redirect_uri=${redirectUri}&state=${state}`;
    
    window.location.href = googleAuthUrl;
};

  const handleGithubLogin = (e) => {
  e.preventDefault();
  const baseUrl = 'https://penguinman-backend-production.up.railway.app';
  const redirectUri = encodeURIComponent('https://savorspace.systems/homepage');
  const state = Math.random().toString(36).substring(7);
  
  // Store state in localStorage to verify later
  localStorage.setItem('oauth_state', state);
  
  const githubAuthUrl = `${baseUrl}/oauth2/authorization/github?redirect_uri=${redirectUri}&state=${state}`;
  
  window.location.href = githubAuthUrl;
};

  const handleReactivate = () => {
    navigate('/reactivate-account');
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');

    if (token && refreshToken) {
        // Store tokens
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Navigate to homepage
        navigate('/homepage');
    }
}, [navigate]);


  const validate = () => {
    const errors = {};
    if (!loginData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = 'Invalid email address';
    if (!loginData.password) errors.password = 'Password is required';
    else if (loginData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(loginData);
      console.log('Login Response:', response); // Debug line
      onLogin(); 

      await new Promise(resolve => setTimeout(resolve, 1500));
      if(response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      navigate('/homepage');
    } catch (error) {
      console.log('Error Response:', error.response); // Debug line
      let errorMsg = error.response?.data?.error || "Something went wrong. Please try again later.";
      setErrorMessage(errorMsg);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {showErrorToast && (
    <div className="error-toast">
      <div className="error-toast-content">
        <div className="error-icon">❌</div>
        <p>{errorMessage}</p>
      </div>
    </div>
    )}

      {isLoading && (
      <div className="loading-overlay">
        <div className="loader-container">
          <div className="loader-ring"></div>
          <div className="loader-ring-2"></div>
          <div className="loader-icon">👨‍🍳</div>
        </div>
        <div className="loading-text">
          Preparing your kitchen<span className="loading-dots"></span>
        </div>
      </div>
    )}
      <div className="login-hero">
        <img src={getImagePath("login-hero.png")} alt="Welcome back to SavorSpace" />
        <h3>Welcome back, Chef!</h3>
      </div>
      <div className="arrow-container"></div>
      <IoIosArrowForward className="btn-back" size={30} color="#000" cursor="pointer" onClick={() => window.location.href = '/'} />
      <div className="form-section-login">
        <h2 className="login-h2">Login to SavorSpace</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
          
          <div className="login-form" style={{ position: 'relative' }}>
              <label>Password</label>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                paddingRight: '2.5rem',
                alignItems: 'center', 
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>
            {errors.password && <span className="error">{errors.password}</span>}
        </div>

          <button type="submit" className="login-btn">Log In</button>
        </form>
          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
          </div>
        <div className="login-options">
          <span>Don&apos;t have an account? <Link to="/register" className="register">Register</Link></span>
          <p>--Or log in with --</p>
          <div className="social-options">
            <button onClick={handleGoogleLogin} className="google-btn">
              <FcGoogle />
              <span>Google</span>
            </button>
            <button onClick={handleGithubLogin} className="github-btn">
              <IoLogoGithub />
              <span>Github</span>
            </button>
          </div>
          <div className="reactivate">
            <span>Deactivated Account? Activate it here!</span>
            <button onClick={handleReactivate} className="reactivate-btn">
                <span>Reactivate Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;