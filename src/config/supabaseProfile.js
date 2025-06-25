import { supabase, getPublicUrl } from './supabaseClient';

export async function uploadProfileImage(file, userId) {
  if (!file || !userId) throw new Error('File and User ID are required');

  // File validation
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit');
  }

  const path = `profiles/${userId}/avatar`;
  const bucket = 'profile-images';

  try {
    // Remove existing file if any
    await supabase.storage.from(bucket).remove([path]);

    // Upload new file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // Get public URL with transformation
    const { data: { publicUrl } } = getPublicUrl(path, bucket, {
      width: 200,
      height: 200,
      resize: 'cover'
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

// Export getPublicUrl again for direct import if needed
export { getPublicUrl };
