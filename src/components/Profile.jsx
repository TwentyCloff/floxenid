import { useEffect, useState, useRef } from 'react';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { uploadProfileImage } from '../config/supabaseProfile';
import { FaCheck, FaTimes, FaEdit, FaCamera } from 'react-icons/fa';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const db = getFirestore();

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [nameError, setNameError] = useState('');
  const fileInputRef = useRef(null);
  const uploadTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const defaultName = `Floxen_User${Math.floor(1000 + Math.random() * 9000)}`;
        setDisplayName(currentUser.displayName || defaultName);
        setPreviewImage(currentUser.photoURL || '');

        // Create user document if not exists
        const userDoc = doc(db, 'users', currentUser.uid);
        await setDoc(userDoc, {
          uid: currentUser.uid,
          displayName: currentUser.displayName || defaultName,
          email: currentUser.email,
          photoURL: currentUser.photoURL || '',
          createdAt: new Date()
        }, { merge: true });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setNameError('File size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setNameError('');
    }
  };

  const validateName = (name) => {
    if (name.length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    }
    if (name.length > 19) {
      setNameError('Name must be less than 20 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateName(displayName)) return;

    try {
      setLoading(true);
      let photoURL = user.photoURL;

      if (profileImage) {
        photoURL = await uploadProfileImage(profileImage, user.uid);
        setUploadSuccess(true);
        uploadTimeoutRef.current = setTimeout(() => setUploadSuccess(false), 3000);
      }

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });

      // Update Firestore document
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        displayName,
        photoURL: photoURL || user.photoURL
      }, { merge: true });

      setUser({ ...auth.currentUser });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNameError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user.displayName || '');
    setPreviewImage(user.photoURL || '');
    setProfileImage(null);
    setEditMode(false);
    setNameError('');
  };

  if (loading) return (
    <div className="min-h-screen pt-[4.75rem] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-[4.75rem] lg:pt-[5.25rem] bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {/* Upload Success Notification */}
      {uploadSuccess && (
        <div className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded z-50 animate-fade-in">
          Foto Profile Berhasil Di Unggah
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden shadow-md">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {editMode && (
                <>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaCamera />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                {editMode ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        validateName(e.target.value);
                      }}
                      className="text-2xl font-bold border-b border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-indigo-500"
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
                )}
                
                <div className="flex space-x-2">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <FaTimes className="mr-1" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading || nameError}
                        className={`px-4 py-2 rounded-lg text-white flex items-center ${
                          loading || nameError ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        } transition-colors`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaCheck className="mr-1" /> Save
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-gray-800 font-mono">{user.uid.substring(0, 8)}...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
