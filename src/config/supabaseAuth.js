import { supabase } from './supabaseClient';
import { auth } from './firebaseConfig';

// Fungsi untuk sinkronisasi session Firebase ke Supabase
export const syncFirebaseToSupabase = async (firebaseUser) => {
  if (!firebaseUser) return null;

  // Dapatkan token ID dari Firebase
  const token = await firebaseUser.getIdToken();

  // Login ke Supabase menggunakan token Firebase
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google', // Meskipun email, kita gunakan google provider
    token: token
  });

  if (error) {
    console.error('Supabase auth error:', error);
    return null;
  }

  return data.session;
};

// Listener untuk perubahan auth state di Firebase
export const setupAuthListener = () => {
  return auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      await syncFirebaseToSupabase(firebaseUser);
    } else {
      await supabase.auth.signOut();
    }
  });
};
