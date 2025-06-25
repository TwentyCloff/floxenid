import { createClient } from '@supabase/supabase-js';

// Ganti dengan kredensial milikmu
const supabaseUrl = 'https://meppqytugnpzabklqlyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHBxeXR1Z25wemFia2xxbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDE0MTgsImV4cCI6MjA2NjMxNzQxOH0.YHKEvbg7OruM4BHZpnOAvc5ykwUHF3mDRJgbDeuV6TE'; // dipotong demi keamanan
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload atau ganti foto profil user
 * @param {File} file - File gambar dari input
 * @param {String} userId - ID unik user (misalnya dari auth user.id)
 * @returns {String} URL publik dari foto profil
 */
export async function uploadProfileImage(file, userId) {
  if (!file || !userId) throw new Error('File dan User ID wajib diisi.');

  const path = `profiles/${userId}/profile.jpg`; // Hanya 1 file per user
  const bucket = 'profile-images';

  // Hapus dulu jika sudah ada (opsional, karena update() juga bisa replace)
  await supabase.storage.from(bucket).remove([path]);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true, // overwrite jika sudah ada
      contentType: file.type
    });

  if (uploadError) {
    console.error('Upload profile image error:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
