// Production Configuration for Fingerprint SDK
// This script provides production-safe defaults and error handling

window.FingerprintConfig = {
    // Production settings
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // Fingerprint API URL (from Laravel config)
    apiUrl: window.FINGERPRINT_API_URL || 'https://lams-fingerprint-api.onrender.com',
    
    // WebSDK settings
    enableWebSDK: false, // Disable WebSDK in production by default
    
    // Error handling
    suppressConnectionErrors: true,
    
    // Initialize fingerprint functionality
    init: function() {
        if (this.isProduction) {
            console.log('Fingerprint: Running in production mode');
            console.log('Fingerprint API URL:', this.apiUrl);
            
            // Disable WebSDK connection attempts in production
            if (window.WebSdk && window.WebSdk.WebChannelClient) {
                console.log('Fingerprint: WebSDK disabled for production');
            }
        } else {
            console.log('Fingerprint: Running in development mode');
        }
    },
    
    // Handle fingerprint enrollment gracefully
    handleEnrollment: function(callback) {
        if (this.isProduction && !this.enableWebSDK) {
            console.warn('Fingerprint enrollment requires physical hardware connection');
            if (callback) {
                callback(new Error('Fingerprint hardware not available in production'));
            }
            return false;
        }
        return true;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    window.FingerprintConfig.init();
});

// Export for use in other scripts
window.FingerprintConfig = window.FingerprintConfig;