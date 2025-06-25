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
    // 1. Hapus gambar lama jika ada
    const { error: removeError } = await supabase.storage
      .from(bucket)
      .remove([path]);

    // 2. Upload gambar baru
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // 3. Dapatkan URL publik
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path, {
        // Transformasi gambar (opsional)
        transform: {
          width: 200,
          height: 200,
          resize: 'cover'
        }
      });

    return publicUrl;
  } catch (error) {
    console.error('Error upload:', error);
    throw new Error(`Gagal mengupload gambar: ${error.message}`);
  }
}

// Fungsi untuk menghapus gambar
export async function deleteProfileImage(userId) {
  const path = `profiles/${userId}/avatar`;
  const bucket = 'profile-images';

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
  return true;
}
