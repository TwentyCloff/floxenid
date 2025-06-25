import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { uploadProfileImage } from '../config/supabaseProfile';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setFormData({
        ...formData,
        profileImage: file
      });
      setPreviewImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Upload profile image if exists
        let photoURL = '';
        if (formData.profileImage) {
          photoURL = await uploadProfileImage(formData.profileImage, userCredential.user.uid);
        }

        // Update user profile
        await updateProfile(userCredential.user, {
          displayName: formData.username,
          photoURL: photoURL
        });

        navigate('/');
      } else {
        // Sign In
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        navigate('/');
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Incorrect password';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    if (containerRef.current) {
      containerRef.current.classList.toggle('active');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div 
        ref={containerRef}
        className={`auth-container relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 ease-in-out ${isSignUp ? 'active' : ''}`}
      >
        {/* Image Section */}
        <div className="image-section w-full md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-8 transition-all duration-500 ease-in-out">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {isSignUp ? 'Welcome!' : 'Welcome Back!'}
            </h2>
            <p className="opacity-90">
              {isSignUp ? 'Create your account and start your journey' : 'Sign in to access your account'}
            </p>
            
            {/* Profile Image Upload (only shown in sign up) */}
            {isSignUp && (
              <div className="mt-8 flex flex-col items-center">
                <div 
                  className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-white/30 transition-colors"
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="mt-2 text-sm opacity-80">Add profile photo</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section w-full md:w-1/2 p-8 md:p-12 transition-all duration-500 ease-in-out">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h1>
          <p className="text-gray-600 mb-8">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
                minLength={isSignUp ? 6 : 1}
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          height: 600px;
        }
        
        .auth-container.active .image-section {
          transform: translateX(100%);
        }
        
        .auth-container.active .form-section {
          transform: translateX(-100%);
        }
        
        .image-section, .form-section {
          transition: transform 0.5s ease-in-out;
        }
        
        @media (max-width: 767px) {
          .auth-container {
            height: auto;
          }
          
          .auth-container.active .image-section {
            transform: translateY(-100%);
          }
          
          .auth-container.active .form-section {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Auth;
