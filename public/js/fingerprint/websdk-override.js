// WebSDK Override for Production Environment
// This script prevents the WebSDK from trying to connect to localhost in production

(function() {
    'use strict';
    
    // Store original XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    
    // Override XMLHttpRequest to intercept WebSDK connection attempts
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        
        xhr.open = function(method, url, async, user, password) {
            // Check if this is a WebSDK connection attempt to localhost
            if (url && url.includes('127.0.0.1:52181/get_connection')) {
                console.warn('WebSDK: Intercepted localhost connection attempt - this is normal in production');
                
                // Create a mock response that will gracefully fail
                setTimeout(() => {
                    const event = new Event('error');
                    if (xhr.onerror) {
                        xhr.onerror(event);
                    }
                }, 100);
                
                return;
            }
            
            // For all other requests, proceed normally
            return originalOpen.call(this, method, url, async, user, password);
        };
        
        return xhr;
    };
    
    // Copy static properties
    for (let prop in originalXHR) {
        if (originalXHR.hasOwnProperty(prop)) {
            window.XMLHttpRequest[prop] = originalXHR[prop];
        }
    }
    
    console.log('WebSDK Override: Localhost connection interception enabled');
})();