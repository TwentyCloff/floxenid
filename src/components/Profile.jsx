import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { uploadProfileImage } from '../config/supabaseProfile';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setPreviewImage(currentUser.photoURL || '');
        setLoading(false);
      } else {
        navigate('/signin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update profile image if changed
      if (profileImage) {
        const imageUrl = await uploadProfileImage(profileImage, user.uid);
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: imageUrl
        });
      } else {
        await updateProfile(auth.currentUser, {
          displayName
        });
      }

      // Refresh user data
      setUser({ ...auth.currentUser });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setPreviewImage('');
    // Note: You'll need to implement actual deletion from Supabase storage
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gray-50 px-6 py-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="relative">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  {editMode && (
                    <>
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-sm border border-gray-300 hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {previewImage && (
                        <button 
                          onClick={handleDeleteImage}
                          className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-sm border border-gray-300 hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div>
                  {editMode ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="text-2xl font-bold text-gray-900 bg-gray-100 rounded-md px-3 py-1"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{user.displayName || 'Your Name'}</h1>
                  )}
                  <p className="text-sm text-gray-500">ID: {user.uid.substring(0, 7)}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {editMode ? (
                  <>
                    <button 
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Account Information */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Created</label>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(user.metadata.creationTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Sign In</label>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(user.metadata.lastSignInTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
                <div className="space-y-4">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Two-Factor Authentication
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Connected Devices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
