import { getPayload } from 'payload'
import config from './src/payload.config'

async function testConnection() {
  try {
    const payload = await getPayload({ config })
    console.log('✅ Payload connected successfully')
    const media = await payload.find({
      collection: 'media',
      where: { id: { in: [9, 8, 7] } },
    })
    console.log('✅ Media query successful:', media.docs.length, 'records found')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

testConnection()
