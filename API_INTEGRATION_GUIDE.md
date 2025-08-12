# Python Service Integration Guide

This document explains how to configure your React application to work with your custom Python web service.

## Service Configuration

### **1. Update Service URL**
Edit `src/services/apiService.js` and replace the placeholder URL with your actual Python service URL:

```javascript
// In the ApiService constructor, replace this line:
constructor(baseURL = 'http://localhost:5001') {
// With your actual URL:
constructor(baseURL = 'http://192.168.1.100:8080') {
```

**URL Format:**
- Use the format: `http://localhost:5001` (without trailing slash)
- Examples:
  - `http://192.168.1.100:8080`
  - `http://10.0.0.50:5000`
  - `http://127.0.0.1:8000`

### Step 2: Test the Integration

1. **Login as Admin**: Use admin credentials to access the API test page
2. **Navigate to API Test**: Go to `/api-test` in your browser
3. **Run Tests**: The page will automatically test all endpoints when loaded

## Supported API Endpoints

Your React application now supports these exact endpoints from your Python service:

### 1. Agent Upload Files
- **Method**: POST
- **Endpoint**: `/agent/upload_files`
- **Usage**: Upload files to your Python service
- **Example**:
```javascript
import { apiService } from '../services/apiService';

const uploadFile = async (file) => {
  const result = await apiService.agentUploadFiles(file, {
    description: 'User uploaded file',
    timestamp: new Date().toISOString()
  });
  return result;
};
```

### 2. Get User Stories
- **Method**: GET
- **Endpoint**: `/user_stories?user=user@example.com`
- **Usage**: Retrieve user stories for a specific user
- **Example**:
```javascript
const getUserStories = async () => {
  const stories = await apiService.getUserStories('user@example.com');
  return stories;
};
```

### 3. Update User Stories
- **Method**: PUT
- **Endpoint**: `/user_stories`
- **Usage**: Update user stories
- **Example**:
```javascript
const updateStories = async (storyData) => {
  const result = await apiService.updateUserStories(storyData);
  return result;
};
```

### 4. Get Test Plans
- **Method**: GET
- **Endpoint**: `/test_plans`
- **Usage**: Retrieve test plans
- **Example**:
```javascript
const getTestPlans = async () => {
  const plans = await apiService.getTestPlans();
  return plans;
};
```

### 5. Update Test Plans
- **Method**: PUT
- **Endpoint**: `/test_plans`
- **Usage**: Update test plans
- **Example**:
```javascript
const updateTestPlans = async (planData) => {
  const result = await apiService.updateTestPlans(planData);
  return result;
};
```

### 6. Get Agent Tools
- **Method**: GET
- **Endpoint**: `/agent/tools`
- **Usage**: Get available agent tools
- **Example**:
```javascript
const getTools = async () => {
  const tools = await apiService.getAgentTools();
  return tools;
};
```

### 7. Health Check
- **Method**: GET
- **Endpoint**: `/health`
- **Usage**: Check if your Python service is running
- **Example**:
```javascript
const checkHealth = async () => {
  const isHealthy = await apiService.checkHealth();
  return isHealthy; // returns true/false
};
```

## Error Handling

The API service includes comprehensive error handling:

```javascript
try {
  const result = await apiService.getUserStories('user@example.com');
  console.log('Success:', result);
} catch (error) {
  console.error('API Error:', error.message);
  // Handle the error appropriately in your UI
}
```

## Authentication

If your Python service requires authentication, you can set headers:

```javascript
import { apiService } from '../services/apiService';

// Set Bearer token
apiService.setAuth('your-jwt-token', 'Bearer');

// Or set custom headers
apiService.setHeaders({
  'Authorization': 'ApiKey your-api-key',
  'X-Custom-Header': 'custom-value'
});
```

## CORS Configuration

Make sure your Python service allows CORS requests from your React app. Your Python service should include these headers:

```python
# Example CORS headers for your Python service
Access-Control-Allow-Origin: http://localhost:5175
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Verify your Python service is running
   - Check the URL in `serviceConfig.js`
   - Ensure firewall allows the connection

2. **CORS Errors**
   - Configure CORS in your Python service
   - Allow requests from `http://localhost:5175`

3. **404 Errors**
   - Verify endpoint URLs match exactly
   - Check your Python service route definitions

### Testing Steps:

1. **Test Health Endpoint**: Start with `/health` to verify basic connectivity
2. **Check Browser Network Tab**: See actual HTTP requests and responses
3. **Use API Test Page**: Navigate to `/api-test` for comprehensive testing
4. **Check Console Logs**: Look for detailed error messages

## Integration in Your Components

Here's how to use the API service in your existing components:

```javascript
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await apiService.getUserStories('user@example.com');
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Render your data */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

## Next Steps

1. **Update Service URL**: Replace `http://localhost:5001` in `src/services/apiService.js` with your actual Python service URL
2. **Test Integration**: Use the `/api-test` page to verify all endpoints work
3. **Update Components**: Integrate the API calls into your existing React components
4. **Handle Errors**: Implement proper error handling and user feedback
5. **Add Loading States**: Show loading indicators while API calls are in progress
