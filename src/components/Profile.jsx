import { useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { FaCheck, FaTimes, FaEdit } from 'react-icons/fa';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const db = getFirestore();

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  // Load user data with real-time updates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!auth.currentUser) throw new Error('Anda belum login!');
      
      if (!displayName.trim()) {
        setNameError('Nama tidak boleh kosong');
        return;
      }
      
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim()
      });

      await setDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim(),
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      const updatedUser = {
        ...auth.currentUser,
        displayName: displayName.trim()
      };
      setUser(updatedUser);
      setEditMode(false);
      setNameError('');
    } catch (error) {
      console.error("Error saving profile:", error);
      setNameError('Terjadi kesalahan saat menyimpan profil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen pt-[4.75rem] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-[4.75rem] lg:pt-[5.25rem] bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
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
                        if (nameError) setNameError('');
                      }}
                      className="text-2xl font-bold border-b border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold text-gray-800">
                    {displayName || 'User'}
                  </h1>
                )}

                <div className="flex gap-2">
                  {editMode ? (
                    <>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setNameError('');
                          setDisplayName(user.displayName || '');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                      >
                        <FaTimes /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-1"
                      >
                        {loading ? 'Saving...' : <><FaCheck /> Save</>}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <FaEdit /> Edit Profile
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
                  <p className="text-gray-800 font-mono text-sm">{user.uid}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
