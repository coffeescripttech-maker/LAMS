// Fingerprint Logger - Enhanced logging and status management
window.FingerprintLogger = {
    debugMode: true,
    
    // Log levels
    levels: {
        INFO: { color: 'text-info', icon: 'ℹ️', console: 'log' },
        SUCCESS: { color: 'text-success', icon: '✓', console: 'log' },
        WARNING: { color: 'text-warning', icon: '⚠️', console: 'warn' },
        ERROR: { color: 'text-danger', icon: '✗', console: 'error' },
        DEBUG: { color: 'text-secondary', icon: '🔍', console: 'log' }
    },

    // Log to both console and UI
    log: function(level, message, details = null) {
        const timestamp = new Date().toLocaleTimeString();
        const levelInfo = this.levels[level] || this.levels.INFO;
        
        // Console logging
        const consoleMsg = `[${timestamp}] [${level}] ${message}`;
        if (details) {
            console[levelInfo.console](consoleMsg, details);
        } else {
            console[levelInfo.console](consoleMsg);
        }
        
        // UI logging (if debug console exists)
        if (this.debugMode && document.getElementById('debug-log')) {
            const logEntry = document.createElement('div');
            logEntry.className = levelInfo.color;
            logEntry.innerHTML = `<span class="text-muted">[${timestamp}]</span> ${levelInfo.icon} ${message}`;
            
            const debugLog = document.getElementById('debug-log');
            debugLog.appendChild(logEntry);
            debugLog.scrollTop = debugLog.scrollHeight;
        }
    },

    info: function(message, details) {
        this.log('INFO', message, details);
    },

    success: function(message, details) {
        this.log('SUCCESS', message, details);
    },

    warning: function(message, details) {
        this.log('WARNING', message, details);
    },

    error: function(message, details) {
        this.log('ERROR', message, details);
    },

    debug: function(message, details) {
        if (this.debugMode) {
            this.log('DEBUG', message, details);
        }
    },

    // Update status alert in modal
    updateStatus: function(type, title, message, showSpinner = false) {
        const alert = document.getElementById('reader-status-alert');
        const titleEl = document.getElementById('reader-status-title');
        const messageEl = document.getElementById('reader-status-message');
        const spinner = document.getElementById('reader-spinner');
        
        if (!alert) return;
        
        // Update alert type
        alert.className = `alert mx-3 mt-3 mb-0 alert-${type}`;
        
        // Update content
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        
        // Show/hide spinner
        if (spinner) {
            spinner.style.display = showSpinner ? 'inline-block' : 'none';
        }
        
        // Show alert
        alert.style.display = 'block';
        
        // Log to console
        this.info(`Status: ${title} - ${message}`);
    },

    // Hide status alert
    hideStatus: function() {
        const alert = document.getElementById('reader-status-alert');
        if (alert) {
            alert.style.display = 'none';
        }
    },

    // Update button state
    updateButton: function(text, enabled = true, variant = 'info') {
        const btn = document.getElementById('fingerprint');
        const btnText = document.getElementById('fingerprint-btn-text');
        
        if (btn) {
            btn.disabled = !enabled;
            btn.className = `btn btn-${variant}`;
        }
        
        if (btnText) {
            btnText.textContent = text;
        }
    },

    // Show message in status div
    showMessage: function(message, type = 'secondary') {
        const statusDiv = document.getElementById('status');
        if (statusDiv) {
            statusDiv.className = `alert alert-${type} text-center py-2 mb-3`;
            statusDiv.textContent = message;
            statusDiv.style.display = message ? 'block' : 'none';
        }
    },

    // Clear debug log
    clearLog: function() {
        const debugLog = document.getElementById('debug-log');
        if (debugLog) {
            debugLog.innerHTML = '<div class="text-success">Debug console cleared...</div>';
        }
    },

    // System check
    checkSystem: function() {
        this.info('=== System Check ===');
        this.debug('Hostname: ' + window.location.hostname);
        this.debug('Protocol: ' + window.location.protocol);
        this.debug('URL: ' + window.location.href);
        
        // Check for enable_reader parameter
        const urlParams = new URLSearchParams(window.location.search);
        const enableReader = urlParams.get('enable_reader');
        this.debug('enable_reader parameter: ' + (enableReader || 'not set'));
        
        // Check FingerprintConfig
        if (window.FingerprintConfig) {
            this.debug('FingerprintConfig found');
            this.debug('- isProduction: ' + window.FingerprintConfig.isProduction);
            this.debug('- enableWebSDK: ' + window.FingerprintConfig.enableWebSDK);
            this.debug('- apiUrl: ' + window.FingerprintConfig.apiUrl);
        } else {
            this.warning('FingerprintConfig not found');
        }
        
        // Check Fingerprint SDK
        if (typeof Fingerprint !== 'undefined') {
            this.success('Fingerprint SDK loaded');
        } else {
            this.error('Fingerprint SDK not loaded');
        }
        
        this.info('=== System Check Complete ===');
    }
};

// Alias for backward compatibility
window.fpLog = window.FingerprintLogger;
