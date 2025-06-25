import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://meppqytugnpzabklqlyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHBxeXR1Z25wemFia2xxbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDE0MTgsImV4cCI6MjA2NjMxNzQxOH0.YHKEvbg7OruM4BHZpnOAvc5ykwUHF3mDRJgbDeuV6TE';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadProfileImage(file, userId) {
  if (!file || !userId) throw new Error('File and User ID are required');

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  // Validate file size (5MB max)
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

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}
