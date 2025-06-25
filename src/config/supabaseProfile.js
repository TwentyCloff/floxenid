import { supabase } from './supabaseClient';

export async function uploadProfileImage(file, userId) {
  if (!file || !userId) throw new Error('File and User ID are required');

  // Validasi tipe file
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  // Validasi ukuran file (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit');
  }

  const path = `profiles/${userId}/avatar`;
  const bucket = 'profile-images';

  try {
    // Langsung upload tanpa cek auth
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
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
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

export async function deleteProfileImage(userId) {
  const path = `profiles/${userId}/avatar`;
  const bucket = 'profile-images';

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}
