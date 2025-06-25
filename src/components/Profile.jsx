import { useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { uploadProfileImage } from "../config/supabaseProfile";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setPreviewImage(currentUser.photoURL || "");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let photoURL = user.photoURL;

      if (profileImage) {
        photoURL = await uploadProfileImage(profileImage, user.uid);
      }

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });

      setUser({ ...auth.currentUser });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-[4.75rem] lg:pt-[5.25rem] bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              {editMode && (
                <div className="mt-4 flex flex-col items-center">
                  <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer">
                    Change Photo
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                {editMode ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-2xl font-bold border-b border-gray-300 px-2 py-1 w-full"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-800">{user.displayName || "No Name"}</h1>
                )}
                <button
                  onClick={() => editMode ? handleSave() : setEditMode(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editMode ? "Save" : "Edit"}
                </button>
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
