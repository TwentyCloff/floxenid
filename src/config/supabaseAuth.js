import { supabase } from './supabaseClient';
import { auth } from './firebaseConfig';

// Sinkronkan Firebase Auth ke Supabase
export const syncFirebaseToSupabase = async (firebaseUser) => {
  if (!firebaseUser) return null;

  try {
    const token = await firebaseUser.getIdToken();
    
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google', // Pakai provider google meskipun email
      token: token
    });

    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Gagal sinkronisasi ke Supabase:', error);
    return null;
  }
};

// Listener untuk sinkronisasi real-time
export const setupAuthListener = () => {
  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      await syncFirebaseToSupabase(user);
    } else {
      await supabase.auth.signOut();
    }
  });
};
