// Webhook Testing Utility for Embedded Forms
// Tests the ActiveCampaign webhook system with embedded form data

export interface TestWebhookPayload {
  contact: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
  programId: string
  leadSource: 'website_embedded' | 'facebook' | 'website'
}

export interface WebhookTestResult {
  success: boolean
  contactId: string
  tagsApplied: number[]
  listMembership: boolean
  error?: string
  processingTime: number
}

// Test webhook with embedded form data
export async function testEmbeddedFormWebhook(payload: TestWebhookPayload): Promise<WebhookTestResult> {
  const startTime = performance.now()
  
  try {
    console.log('🧪 Testing webhook with embedded form data:', payload)
    
    // Simulate ActiveCampaign webhook payload format
    const webhookPayload = {
      contact: {
        id: payload.contact.id,
        email: payload.contact.email,
        firstName: payload.contact.firstName,
        lastName: payload.contact.lastName
      },
      type: 'contact_updated', // Typical AC webhook event type
      timestamp: Date.now()
    }
    
    // Call the webhook endpoint
    const response = await fetch('/api/activecampaign-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookPayload)
    })
    
    const result = await response.json()
    const processingTime = performance.now() - startTime
    
    if (response.ok && result.success) {
      return {
        success: true,
        contactId: result.contactId || payload.contact.id,
        tagsApplied: result.classTagApplied ? [result.classTagApplied] : [],
        listMembership: result.addedToList4 || false,
        processingTime
      }
    } else {
      return {
        success: false,
        contactId: payload.contact.id,
        tagsApplied: [],
        listMembership: false,
        error: result.error || 'Webhook failed',
        processingTime
      }
    }
    
  } catch (error: any) {
    const processingTime = performance.now() - startTime
    return {
      success: false,
      contactId: payload.contact.id,
      tagsApplied: [],
      listMembership: false,
      error: error.message,
      processingTime
    }
  }
}

// Generate test data for different program types
export function generateTestData(programId: string): TestWebhookPayload {
  const testContactId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  
  return {
    contact: {
      id: testContactId,
      email: `test_${testContactId}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    },
    programId,
    leadSource: 'website_embedded'
  }
}

// Test all program webhooks
export async function testAllProgramWebhooks(): Promise<Record<string, WebhookTestResult>> {
  const programIds = [
    'little-stars',
    'red-ball', 
    'orange-ball',
    'green-dot',
    'youth-development',
    'high-performance',
    'adult-beginner-1',
    'adult-intermediate',
    'adult-advanced',
    'cardio-tennis',
    'liveball-intermediate',
    'liveball-advanced'
  ]
  
  const results: Record<string, WebhookTestResult> = {}
  
  for (const programId of programIds) {
    console.log(`🧪 Testing webhook for program: ${programId}`)
    const testData = generateTestData(programId)
    results[programId] = await testEmbeddedFormWebhook(testData)
    
    // Small delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  return results
}

// Validate webhook test results
export function validateWebhookResults(results: Record<string, WebhookTestResult>): {
  passed: string[]
  failed: string[]
  summary: {
    totalTests: number
    passedTests: number
    failedTests: number
    averageProcessingTime: number
  }
} {
  const passed: string[] = []
  const failed: string[] = []
  let totalProcessingTime = 0
  
  Object.entries(results).forEach(([programId, result]) => {
    if (result.success) {
      passed.push(programId)
    } else {
      failed.push(programId)
    }
    totalProcessingTime += result.processingTime
  })
  
  const totalTests = Object.keys(results).length
  const averageProcessingTime = totalTests > 0 ? totalProcessingTime / totalTests : 0
  
  return {
    passed,
    failed,
    summary: {
      totalTests,
      passedTests: passed.length,
      failedTests: failed.length,
      averageProcessingTime
    }
  }
}

// Test webhook performance under load
export async function stressTestWebhook(programId: string, concurrentRequests: number = 5): Promise<{
  results: WebhookTestResult[]
  averageTime: number
  successRate: number
}> {
  console.log(`🔥 Stress testing webhook with ${concurrentRequests} concurrent requests for ${programId}`)
  
  const promises: Promise<WebhookTestResult>[] = []
  
  for (let i = 0; i < concurrentRequests; i++) {
    const testData = generateTestData(programId)
    testData.contact.id = `stress_test_${i}_${testData.contact.id}`
    promises.push(testEmbeddedFormWebhook(testData))
  }
  
  const results = await Promise.all(promises)
  
  const successfulResults = results.filter(r => r.success)
  const averageTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length
  const successRate = (successfulResults.length / results.length) * 100
  
  return {
    results,
    averageTime,
    successRate
  }
}

// Mock ActiveCampaign API responses for testing
export const mockACResponses = {
  contact: {
    id: 'test_contact_123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  },
  fieldValues: [
    { field: '7', value: 'Little Tennis Stars' }, // PROGRAM
    { field: '8', value: 'Moulton Meadows' }, // LOCATION  
    { field: '15', value: 'website_embedded' } // LEAD_SOURCE
  ],
  contactTags: [],
  contactLists: []
}

// Console logging utilities for test results
export function logWebhookTestResults(results: Record<string, WebhookTestResult>): void {
  console.group('🧪 Webhook Test Results')
  
  Object.entries(results).forEach(([programId, result]) => {
    const status = result.success ? '✅' : '❌'
    const time = `${result.processingTime.toFixed(2)}ms`
    
    console.log(`${status} ${programId} - ${time}`)
    
    if (!result.success && result.error) {
      console.error(`   Error: ${result.error}`)
    }
    
    if (result.success && result.tagsApplied.length > 0) {
      console.log(`   Tags applied: ${result.tagsApplied.join(', ')}`)
    }
  })
  
  const validation = validateWebhookResults(results)
  console.log('\n📊 Summary:')
  console.log(`   Total tests: ${validation.summary.totalTests}`)
  console.log(`   Passed: ${validation.summary.passedTests}`)
  console.log(`   Failed: ${validation.summary.failedTests}`)
  console.log(`   Average time: ${validation.summary.averageProcessingTime.toFixed(2)}ms`)
  
  console.groupEnd()
}
