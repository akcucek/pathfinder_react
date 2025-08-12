// Simple test script to check RCA API connectivity
// Run this with: node test-rca-api.js

const fetch = require('node-fetch');

async function testRCAAPI() {
    const jiraKey = 'RCA-180';
    const url = `http://localhost:5001/agent/rca_report?jira_key=${jiraKey}`;
    
    try {
        console.log('Testing RCA API:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            console.log('Response status:', response.status);
            console.log('Response statusText:', response.statusText);
            return;
        }
        
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        if (data.success && data.data) {
            console.log('✅ API is working correctly!');
            console.log('Sample fields extracted:');
            console.log('- jira_key:', data.data.jira_key);
            console.log('- related_jira_keys:', data.data.related_jira_keys);
            console.log('- test_plan_ids:', data.data.test_plan_ids);
            console.log('- user_story_ids:', data.data.user_story_ids);
        } else {
            console.log('❌ API response format is unexpected');
        }
        
    } catch (error) {
        console.log('❌ API connection failed:', error.message);
        console.log('Make sure:');
        console.log('1. The API server is running on http://localhost:5001');
        console.log('2. The server has CORS enabled for http://localhost:5176');
        console.log('3. The /agent/rca_report endpoint exists');
    }
}

testRCAAPI();
