// Production Configuration for Fingerprint SDK
// This script provides production-safe defaults and error handling

window.FingerprintConfig = {
    // Production settings
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // Fingerprint API URL (from Laravel config)
    apiUrl: window.FINGERPRINT_API_URL || 'https://lams-fingerprint-api.onrender.com',
    
    // WebSDK settings - physical fingerprint reader only works with local hardware
    // Enable WebSDK for localhost OR if explicitly enabled via query parameter
    enableWebSDK: window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  new URLSearchParams(window.location.search).get('enable_reader') === 'true',
    
    // Error handling
    suppressConnectionErrors: true,
    
    // Initialize fingerprint functionality
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const enableReaderParam = urlParams.get('enable_reader');
        
        console.log('=== Fingerprint Configuration ===');
        console.log('Environment:', this.isProduction ? 'Production' : 'Development');
        console.log('Hostname:', window.location.hostname);
        console.log('API URL:', this.apiUrl);
        console.log('enable_reader parameter:', enableReaderParam || 'not set');
        console.log('WebSDK enabled:', this.enableWebSDK);
        
        if (this.isProduction) {
            console.log('📍 Production Mode');
            
            if (this.enableWebSDK) {
                console.log('✓ Physical reader support ENABLED');
                console.log('  → Reader can be used for fingerprint enrollment');
                console.log('  → Make sure DigitalPersona SDK is installed');
            } else {
                console.log('⚠ Physical reader support DISABLED');
                console.log('  → Fingerprint enrollment requires physical reader');
                console.log('  → Reader will be auto-enabled when needed');
            }
        } else {
            console.log('🔧 Development Mode');
            console.log('✓ Physical reader support automatically enabled');
        }
        
        console.log('=================================');
    },
    
    // Handle fingerprint enrollment gracefully
    handleEnrollment: function(callback) {
        if (this.isProduction && !this.enableWebSDK) {
            console.warn('Fingerprint enrollment requires physical hardware connection');
            console.warn('Please use a local development environment with a connected fingerprint reader');
            if (callback) {
                callback(new Error('Fingerprint hardware not available in production'));
            }
            return false;
        }
        return true;
    },
    
    // Auto-enable reader if needed
    autoEnableReader: function() {
        if (!this.enableWebSDK && this.isProduction) {
            console.log('Auto-enabling fingerprint reader...');
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('enable_reader', 'true');
            console.log('Redirecting to:', newUrl.toString());
            window.location.href = newUrl.toString();
            return true;
        }
        return false;
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.FingerprintConfig.init();
    });
} else {
    // DOM already loaded
    window.FingerprintConfig.init();
}

// Export for use in other scripts
window.FingerprintConfig = window.FingerprintConfig;