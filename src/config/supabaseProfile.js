import { supabase } from './supabaseClient';
import { auth } from './firebaseConfig';

export async function uploadProfileImage(file, userId) {
  if (!file || !userId) throw new Error('File and User ID are required');

  // Validasi tipe file
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Hanya format JPEG, PNG, atau WebP yang diizinkan');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran file maksimal 5MB');
  }

  const path = `profiles/${userId}/avatar`;
  const bucket = 'profile-images';

  try {
    // Verifikasi session di Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      // Jika tidak ada session, coba sinkronkan Firebase
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Not authenticated');
      
      const supabaseSession = await syncFirebaseToSupabase(firebaseUser);
      if (!supabaseSession) throw new Error('Failed to authenticate with Supabase');
    }

    // Upload file dengan metadata
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
        metadata: {
          owner: userId,
          uploaded_at: new Date().toISOString()
        }
      });

    if (uploadError) throw uploadError;

    // Dapatkan URL publik
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path, {
        transform: {
          width: 200,
          height: 200,
          resize: 'cover'
        }
      });

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Gagal mengupload gambar: ${error.message}`);
  }
}

export async function deleteProfileImage(userId) {
  const path = `profiles/${userId}/avatar`;
  const bucket = 'profile-images';

  try {
    // Verifikasi session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Gagal menghapus gambar: ${error.message}`);
  }
}
