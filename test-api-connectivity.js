#!/usr/bin/env node

/**
 * Simple API Connectivity Test Script
 * ===================================
 * 
 * This script tests connectivity to your backend server
 * Usage: node test-api-connectivity.js [baseURL]
 * Default baseURL: http://localhost:8000
 */

// Get baseURL from command line argument or use default
const baseURL = process.argv[2] || 'http://localhost:8000';

console.log('🔍 Testing API Connectivity...');
console.log(`📡 Target URL: ${baseURL}`);
console.log('⏰ Starting test...\n');

async function testConnectivity(url) {
  const startTime = Date.now();
  
  try {
    // Test using node's built-in fetch (Node 18+) or fallback
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log('✅ Connection Successful!');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Response Time: ${responseTime}ms`);
    console.log(`   URL: ${url}/health`);
    
    // Try to get response body
    try {
      const data = await response.text();
      if (data) {
        console.log(`   Response: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
      }
    } catch (e) {
      console.log('   Response: (Unable to read response body)');
    }
    
    return true;
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.log('❌ Connection Failed!');
    console.log(`   Error: ${error.message}`);
    console.log(`   Response Time: ${responseTime}ms`);
    console.log(`   URL: ${url}/health`);
    
    // Provide helpful suggestions
    console.log('\n💡 Troubleshooting suggestions:');
    console.log('   1. Check if your backend server is running');
    console.log('   2. Verify the correct port and URL');
    console.log('   3. Check firewall/network settings');
    console.log('   4. Ensure CORS is configured if needed');
    
    return false;
  }
}

// Additional endpoint tests
async function testEndpoints(url) {
  const endpoints = [
    '/agent/tools',
    '/user_stories?user=test@example.com',
    '/test_plans'
  ];
  
  console.log('\n🔍 Testing additional endpoints...\n');
  
  for (const endpoint of endpoints) {
    const startTime = Date.now();
    try {
      const fetch = globalThis.fetch || (await import('node-fetch')).default;
      const response = await fetch(`${url}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const responseTime = Date.now() - startTime;
      const status = response.status === 200 ? '✅' : response.status === 404 ? '❓' : '❌';
      
      console.log(`${status} ${endpoint}`);
      console.log(`   Status: ${response.status} (${responseTime}ms)`);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${endpoint}`);
      console.log(`   Error: ${error.message} (${responseTime}ms)`);
    }
  }
}

// Run the test
async function main() {
  const isHealthy = await testConnectivity(baseURL);
  
  if (isHealthy) {
    await testEndpoints(baseURL);
  }
  
  console.log('\n📋 Test Summary:');
  console.log(`   Target: ${baseURL}`);
  console.log(`   Health Check: ${isHealthy ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  // Exit with appropriate code
  process.exit(isHealthy ? 0 : 1);
}

main().catch(error => {
  console.error('💥 Test script error:', error.message);
  process.exit(1);
});
