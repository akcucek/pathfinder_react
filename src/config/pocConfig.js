/**
 * POC (Proof of Concept) Configuration
 * ===================================
 * 
 * This file contains configuration settings for POC mode.
 * When POC_MODE is true, the application will work with mock data
 * and bypass authentication since backend services may not be fully implemented.
 */

export const POC_CONFIG = {
  // Enable/disable POC mode
  POC_MODE: false,
  // Enable/disable restrict mode
  RESTRICT_MODE: true,
  
  // External service configuration
  EXTERNAL_SERVICE_URL: '', // Use relative URLs for proxy
  
  // Authentication settings for POC
  BYPASS_AUTH: true,
  
  // Default user for POC mode
  DEFAULT_POC_USER: {
    id: 'poc-user-1',
    name: 'POC User',
    email: 'poc@example.com',
    role: 'admin', // 'admin' or 'user'
    department: 'IT'
  },
  
  // API timeouts for POC (shorter for faster fallback)
  API_TIMEOUT: 3000, // 3 seconds
  
  // Mock data settings
  USE_MOCK_DATA_ON_FAILURE: true,
  
  // Console logging for POC debugging
  ENABLE_POC_LOGGING: true
};

// Helper functions for POC mode
export const isPOCMode = () => POC_CONFIG.POC_MODE;
export const shouldBypassAuth = () => POC_CONFIG.POC_MODE && POC_CONFIG.BYPASS_AUTH;
export const getExternalServiceURL = () => POC_CONFIG.EXTERNAL_SERVICE_URL;
export const getPOCUser = () => POC_CONFIG.DEFAULT_POC_USER;

// POC logging helper
export const pocLog = (message, ...args) => {
  if (POC_CONFIG.ENABLE_POC_LOGGING) {
    console.log(`[POC] ${message}`, ...args);
  }
};

export default POC_CONFIG;
