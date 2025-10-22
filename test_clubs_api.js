const axios = require('axios');

// Test the clubs API endpoint
async function testClubsApi() {
  try {
    console.log('Testing clubs API endpoint...');
    
    // First, let's try to get clubs without auth (should fail)
    try {
      const response = await axios.get('http://localhost:4000/api/admin/clubs');
      console.log('Response:', response.data);
    } catch (error) {
      console.log('Expected error (no auth):', error.response?.data || error.message);
    }
    
    console.log('API test completed.');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testClubsApi();