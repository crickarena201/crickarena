const axios = require('axios');

async function testSessionsAPI() {
  try {
    // Test the sessions endpoint
    const response = await axios.get('http://localhost:4000/api/coaches/club/sessions', {
      headers: {
        'Authorization': 'Bearer YOUR_VALID_TOKEN_HERE'
      }
    });
    
    console.log('Sessions API Response:', response.data);
  } catch (error) {
    console.error('Error testing sessions API:', error.response?.data || error.message);
  }
}

testSessionsAPI();