import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash, FaCheck, FaLock, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import PasswordStrengthBar from 'react-password-strength-bar';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '../components/bgNeed/bg2.png';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);
  const [securityChecks, setSecurityChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
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
        length: value.length >= 6,
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
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return false;
    }
    
    return true;
  };

  const createUserDocument = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || '',
          plan: 'Free',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          emailVerified: user.emailVerified || false
        });
      } else {
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error handling user document:", error);
      throw error;
    }
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
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        await createUserDocument(userCredential.user);
        
        setShowSuccess(true);
        successTimeoutRef.current = setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
        
        setIsSignUp(false);
        setFormData({...formData, confirmPassword: ''});
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        try {
          await updateDoc(doc(db, 'users', userCredential.user.uid), {
            lastLogin: serverTimestamp()
          });
        } catch (updateError) {
          console.log("User document doesn't exist yet, will be created on next action");
        }
        
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
          errorMessage = 'Password should be at least 6 characters';
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
          console.error("Authentication error:", err);
          errorMessage = 'Login failed. Please try again.';
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

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(resetEmail)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setShowResetSuccess(true);
      setShowResetModal(false);
      setResetEmail('');
      setTimeout(() => setShowResetSuccess(false), 5000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Success Notifications */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <FaCheck className="text-xl" />
              <span>Account created successfully!</span>
            </div>
          </motion.div>
        )}

        {showResetSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <FaCheck className="text-xl" />
              <span>Password reset link sent to your email!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h2>
              <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <div className="mb-6">
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${loading ? 'opacity-80' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Link <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Auth Container */}
      <div className="w-full max-w-4xl mx-4 bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Image Background */}
        <div className="hidden lg:block relative">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 h-full flex flex-col justify-between text-white p-8">
            <div>
              <h1 className="text-3xl font-bold mb-3">Welcome {isSignUp ? 'to Our Platform' : 'Back'}</h1>
              <p className="text-lg">
                {isSignUp 
                  ? "Join thousands of users who trust our platform for their needs." 
                  : "Sign in to access your personalized dashboard and features."}
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaLock className="text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Authentication</h3>
                  <p className="text-sm opacity-90">End-to-end encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Auth Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaLock className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              {isSignUp ? "Get started with your account" : "Sign in to continue"}
            </p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start"
            >
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  ref={emailInputRef}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm pr-9"
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  required
                  minLength={6}
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
                <div className="mt-2">
                  <PasswordStrengthBar 
                    password={formData.password} 
                    minLength={6}
                    scoreWords={['Too weak', 'Weak', 'Okay', 'Good', 'Strong']}
                    shortScoreWord="Too short"
                    onChangeScore={(score) => setPasswordScore(score)}
                    className="mt-1"
                  />
                  
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center ${securityChecks.length ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">✓</span> 6+ characters
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
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm pr-9"
                    required
                    minLength={6}
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

            {!isSignUp && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setShowResetModal(true);
                    setError('');
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center shadow-sm hover:shadow-md text-sm ${loading ? 'opacity-80' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <FaArrowRight className="ml-1.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-gray-600">
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
