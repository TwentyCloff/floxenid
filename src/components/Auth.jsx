import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import PasswordStrengthBar from 'react-password-strength-bar';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);
  const [securityChecks, setSecurityChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false
  });
  const navigate = useNavigate();
  const successTimeoutRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      setSecurityChecks({
        length: value.length >= 12,
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|protonmail\.com|icloud\.com|edu\.[a-zA-Z]{2,}|gov\.[a-zA-Z]{2,}|mil\.[a-zA-Z]{2,})$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = () => {
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return false;
    }
    
    if (formData.password.length < 12) {
      setError("Password must be at least 12 characters!");
      return false;
    }
    
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain uppercase letters!");
      return false;
    }
    
    if (!/\d/.test(formData.password)) {
      setError("Password must contain numbers!");
      return false;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Password must contain special characters!");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(formData.email)) {
      setError("Invalid email domain. Only approved domains allowed.");
      emailInputRef.current.focus();
      return;
    }
    
    if (isSignUp && !validatePassword()) return;

    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        setShowSuccess(true);
        successTimeoutRef.current = setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
        
        setIsSignUp(false);
        setFormData({...formData, confirmPassword: ''});
      } else {
        await signInWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        navigate('/');
      }
    } catch (err) {
      let errorMessage = 'An error occurred!';
      
      switch(err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered!';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format!';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password too weak! Minimum 12 characters with uppercase, numbers, and special chars.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Account not found!';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Wrong password!';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Try again later.';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changeAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({...formData, confirmPassword: ''});
  };

  return (
    <div className="min-h-screen pt-[4.75rem] lg:pt-[5.25rem] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
            <FaCheck className="text-xl" />
            <span>Account created successfully!</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isSignUp ? "Create Account" : "Sign In"}
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailInputRef}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                  placeholder="Minimum 12 characters"
                  required
                  minLength={12}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {isSignUp && (
                <div className="mt-3">
                  <PasswordStrengthBar 
                    password={formData.password} 
                    minLength={12}
                    scoreWords={['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong']}
                    shortScoreWord="Too Short"
                    onChangeScore={(score) => setPasswordScore(score)}
                  />
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center ${securityChecks.length ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">✓</span> 12+ characters
                    </div>
                    <div className={`flex items-center ${securityChecks.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">✓</span> Uppercase
                    </div>
                    <div className={`flex items-center ${securityChecks.number ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">✓</span> Number
                    </div>
                    <div className={`flex items-center ${securityChecks.specialChar ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">✓</span> Special char
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                    required
                    minLength={12}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isSignUp && passwordScore < 3)}
              className={`w-full py-3 px-4 ${(isSignUp && passwordScore < 3) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-lg transition-all flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? "Creating..." : "Signing in..."}
                </>
              ) : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={changeAuthMode}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
