import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://meppqytugnpzabklqlyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHBxeXR1Z25wemFia2xxbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDE0MTgsImV4cCI6MjA2NjMxNzQxOH0.YHKEvbg7OruM4BHZpnOAvc5ykwUHF3mDRJgbDeuV6TE';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadProfileImage(file, userId) {
  if (!file || !userId) throw new Error('File and User ID are required');

  // Validasi tipe file
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Hanya format JPEG, PNG, atau WebP yang diizinkan');
  }

  // Validasi ukuran file (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran file maksimal 5MB');
  }

  const path = `profiles/${userId}/avatar`;
  const bucket = 'profile-images';

  try {
    // Verifikasi session user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) throw new Error('Not authenticated');

    // Upload dengan metadata owner
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
        metadata: {
          owner: userId  // Penting untuk RLS
        }
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw uploadError;
    }

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
    console.error('Full upload error:', error);
    throw new Error(`Gagal mengupload gambar: ${error.message}`);
  }
}

export async function deleteProfileImage(userId) {
  const path = `profiles/${userId}/avatar`;
  const bucket = 'profile-images';

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Full delete error:', error);
    throw new Error(`Gagal menghapus gambar: ${error.message}`);
  }
}
