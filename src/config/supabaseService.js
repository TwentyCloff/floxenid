import { createClient } from '@supabase/supabase-js'

// Ganti ini dari Project Settings → API
const supabaseUrl = 'https://meppqytugnpzabklqlyh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHBxeXR1Z25wemFia2xxbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDE0MTgsImV4cCI6MjA2NjMxNzQxOH0.YHKEvbg7OruM4BHZpnOAvc5ykwUHF3mDRJgbDeuV6TE'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ----------------------
// 🔐 AUTH SECTION
// ----------------------

export async function register({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// ----------------------
// 📦 STORAGE SECTION
// ----------------------

export async function uploadFile(file, path = 'bukti', bucket = 'product-images') {
  const fileName = `${Date.now()}_${file.name}`
  const fullPath = `${path}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fullPath, file)

  if (uploadError) throw uploadError

  const { data: publicData } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(fullPath)

  return publicData.publicUrl
}

// ----------------------
// 🗂️ DATABASE SECTION
// ----------------------

export async function createTransaction(data) {
  const { error } = await supabase.from('transactions').insert([data])
  if (error) throw error
}

export async function getMyTransactions(user_id) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAllTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateTransactionStatus(id, status) {
  const { error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}
