import { createClient } from '@supabase/supabase-js';

// Ganti dengan project kamu
const supabaseUrl = 'https://meppqytugnpzabklqlyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHBxeXR1Z25wemFia2xxbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDE0MTgsImV4cCI6MjA2NjMxNzQxOH0.YHKEvbg7OruM4BHZpnOAvc5ykwUHF3mDRJgbDeuV6TE';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload file ke bucket Supabase
 * @param {File} file - File dari input
 * @param {String} path - Folder tujuan di bucket (default: 'bukti')
 * @param {String} bucket - Nama bucket (default: 'product-images')
 * @returns {String} URL file yang bisa diakses publik
 */
export async function uploadFile(file, path = 'bukti', bucket = 'product-images') {
  const fileName = `${Date.now()}_${file.name}`;
  const fullPath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fullPath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fullPath);
  return data.publicUrl;
}
