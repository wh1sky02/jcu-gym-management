import { getCloudDatabase } from './cloud-database'

// Database adapter factory - now only returns cloud database
export function getDatabaseAdapter() {
  console.log('🌐 Using Cloud Database (Supabase)')
  return getCloudDatabase()
}

// Export the adapter as default
export default getDatabaseAdapter 