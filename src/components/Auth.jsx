import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash, FaCheck, FaLock, FaEnvelope } from 'react-icons/fa';
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
      // Gunakan UID sebagai document ID
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user document dengan UID sebagai ID
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || '',
          plan: 'Free',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          emailVerified: user.emailVerified || false
        });
      } else {
        // Update last login time for existing user
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
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        // Create user document in Firestore dengan UID sebagai ID
        await createUserDocument(userCredential.user);
        
        setShowSuccess(true);
        successTimeoutRef.current = setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
        
        setIsSignUp(false);
        setFormData({...formData, confirmPassword: ''});
      } else {
        // Sign in existing user
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        // Update last login time menggunakan UID sebagai ID
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
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaLock className="text-blue-600 text-3xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-center text-gray-500 mb-8">
            {isSignUp ? "Get started with your account" : "Sign in to continue"}
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
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
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="user@example.com"
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
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                  placeholder={isSignUp ? "At least 6 characters" : "Your password"}
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
                <div className="mt-3">
                  <PasswordStrengthBar 
                    password={formData.password} 
                    minLength={6}
                    scoreWords={['Too weak', 'Weak', 'Okay', 'Good', 'Strong']}
                    shortScoreWord="Too short"
                    onChangeScore={(score) => setPasswordScore(score)}
                    className="mt-2"
                  />
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
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
                    className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
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
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setError("Password reset functionality not implemented yet")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg ${loading ? 'opacity-80' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? "Creating Account..." : "Signing In..."}
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
