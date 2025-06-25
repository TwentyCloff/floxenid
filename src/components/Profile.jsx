import { useEffect, useState, useRef } from 'react';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { uploadProfileImage, deleteProfileImage } from '../config/supabaseProfile';
import { FaCheck, FaTimes, FaEdit, FaCamera, FaTrash } from 'react-icons/fa';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const db = getFirestore();

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ success: false, message: '' });
  const [nameError, setNameError] = useState('');
  const fileInputRef = useRef(null);

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setPreviewImage(currentUser.photoURL || '');
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setUploadStatus({ success: false, message: 'Format file tidak didukung' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus({ success: false, message: 'Ukuran file maksimal 5MB' });
        return;
      }

      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setUploadStatus({ success: true, message: 'Gambar siap diupload' });
    }
  };

  // Handle delete image
  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      await deleteProfileImage(user.uid);
      
      await updateProfile(auth.currentUser, {
        photoURL: ''
      });

      setPreviewImage('');
      setUploadStatus({ success: true, message: 'Gambar berhasil dihapus' });
    } catch (error) {
      setUploadStatus({ success: false, message: 'Gagal menghapus gambar' });
    } finally {
      setLoading(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setLoading(true);
      let photoURL = user.photoURL;

      // Upload gambar baru jika ada
      if (profileImage) {
        photoURL = await uploadProfileImage(profileImage, user.uid);
        setUploadStatus({ success: true, message: 'Gambar berhasil diupload' });
      }

      // Update profile
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        photoURL
      });

      // Update Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL
      }, { merge: true });

      setEditMode(false);
    } catch (error) {
      setUploadStatus({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen pt-16 bg-gray-50 p-4">
      {/* Status Upload */}
      {uploadStatus.message && (
        <div className={`fixed top-4 right-4 p-3 rounded-md shadow-md z-50 ${
          uploadStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {uploadStatus.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
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
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
                  >
                    <FaCamera />
                  </button>
                  {previewImage && (
                    <button
                      onClick={handleDeleteImage}
                      className="absolute top-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all"
                    >
                      <FaTrash />
                    </button>
                  )}
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

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                {editMode ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="text-2xl font-bold border-b border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                      placeholder="Masukkan nama"
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
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <FaTimes className="inline mr-1" /> Batal
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                      >
                        {loading ? 'Menyimpan...' : (<><FaCheck className="inline mr-1" /> Simpan</>)}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit className="inline mr-1" /> Edit Profile
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
