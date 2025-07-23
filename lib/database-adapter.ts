import { getCloudDatabase } from './cloud-database'

// Database adapter factory - returns Neon cloud database
export function getDatabaseAdapter() {
  console.log('🌐 Using Cloud Database (Neon)')
  return getCloudDatabase()
}

// Export the adapter as default
export default getDatabaseAdapter 