// Test script to verify test cases API integration
const fetch = require('node-fetch');

async function testTestCasesUpdate() {
  try {
    console.log('Testing test cases API integration...');
    
    // First, get existing test cases
    const getResponse = await fetch('http://localhost:5001/test_plans', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!getResponse.ok) {
      throw new Error(`GET request failed with status: ${getResponse.status}`);
    }
    
    const getData = await getResponse.json();
    console.log('GET Response Status:', getResponse.status);
    console.log('Total test cases found:', getData.data?.length || 0);
    
    if (getData.data && getData.data.length > 0) {
      // Test updating the first test case
      const firstTestCase = getData.data[0];
      console.log('Testing with test case ID:', firstTestCase.id);
      
      // Prepare update data with proper format
      const updateData = {
        test_plans: [{
          id: firstTestCase.id,
          title: firstTestCase.title,
          description: firstTestCase.description || firstTestCase.title,
          preconditions: Array.isArray(firstTestCase.preconditions) 
            ? JSON.stringify(firstTestCase.preconditions)
            : firstTestCase.preconditions,
          postconditions: firstTestCase.postconditions,
          expected_result: firstTestCase.expected_result,
          test_steps: firstTestCase.test_steps,
          qa_processed: 1, // Mark as processed
          tags: firstTestCase.tags || "",
          test_plan_id: firstTestCase.test_plan_id,
          user_story_id: firstTestCase.user_story_id,
          void_ind: firstTestCase.void_ind || 0,
          created_at: firstTestCase.created_at,
          updated_at: new Date().toISOString()
        }]
      };
      
      console.log('Sending PUT request with data:', JSON.stringify(updateData, null, 2));
      
      // Test PUT request
      const putResponse = await fetch('http://localhost:5001/test_plans', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      console.log('PUT Response Status:', putResponse.status);
      
      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        console.log('PUT Error Response:', errorText);
        throw new Error(`PUT request failed with status: ${putResponse.status}`);
      }
      
      const putData = await putResponse.json();
      console.log('PUT Response:', JSON.stringify(putData, null, 2));
      
      if (putData.success) {
        console.log('✅ Test cases API integration working correctly!');
      } else {
        console.log('❌ PUT request returned success: false');
      }
    } else {
      console.log('No test cases found to test with');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

testTestCasesUpdate();
