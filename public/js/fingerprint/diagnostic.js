// Fingerprint WebSDK Diagnostic Tool
// Run this in browser console to check if everything is loaded correctly

(function() {
    console.log('='.repeat(60));
    console.log('FINGERPRINT WEBSDK DIAGNOSTIC TOOL');
    console.log('='.repeat(60));
    
    const results = {
        passed: [],
        failed: [],
        warnings: []
    };
    
    // Test 1: Check if Fingerprint SDK is loaded
    console.log('\n1. Checking Fingerprint SDK...');
    if (typeof Fingerprint !== 'undefined') {
        console.log('   ✓ Fingerprint SDK loaded');
        results.passed.push('Fingerprint SDK loaded');
        
        // Check SDK components
        if (Fingerprint.WebApi) {
            console.log('   ✓ Fingerprint.WebApi available');
            results.passed.push('WebApi available');
        } else {
            console.log('   ✗ Fingerprint.WebApi NOT available');
            results.failed.push('WebApi not available');
        }
        
        if (Fingerprint.SampleFormat) {
            console.log('   ✓ Fingerprint.SampleFormat available');
            results.passed.push('SampleFormat available');
        } else {
            console.log('   ✗ Fingerprint.SampleFormat NOT available');
            results.failed.push('SampleFormat not available');
        }
    } else {
        console.log('   ✗ Fingerprint SDK NOT loaded');
        results.failed.push('Fingerprint SDK not loaded');
    }
    
    // Test 2: Check FingerprintConfig
    console.log('\n2. Checking FingerprintConfig...');
    if (typeof window.FingerprintConfig !== 'undefined') {
        console.log('   ✓ FingerprintConfig loaded');
        console.log('   - isProduction:', window.FingerprintConfig.isProduction);
        console.log('   - enableWebSDK:', window.FingerprintConfig.enableWebSDK);
        console.log('   - apiUrl:', window.FingerprintConfig.apiUrl);
        results.passed.push('FingerprintConfig loaded');
    } else {
        console.log('   ✗ FingerprintConfig NOT loaded');
        results.failed.push('FingerprintConfig not loaded');
    }
    
    // Test 3: Check FingerprintLogger
    console.log('\n3. Checking FingerprintLogger...');
    if (typeof window.FingerprintLogger !== 'undefined' || typeof window.fpLog !== 'undefined') {
        console.log('   ✓ FingerprintLogger loaded');
        results.passed.push('FingerprintLogger loaded');
    } else {
        console.log('   ⚠ FingerprintLogger NOT loaded (optional)');
        results.warnings.push('FingerprintLogger not loaded');
    }
    
    // Test 4: Check URL parameters
    console.log('\n4. Checking URL parameters...');
    const urlParams = new URLSearchParams(window.location.search);
    const enableReader = urlParams.get('enable_reader');
    console.log('   - enable_reader parameter:', enableReader || 'not set');
    if (enableReader === 'true') {
        console.log('   ✓ Reader explicitly enabled');
        results.passed.push('Reader enabled via URL');
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('   ✓ Running on localhost (auto-enabled)');
        results.passed.push('Localhost auto-enable');
    } else {
        console.log('   ⚠ Reader not enabled (will auto-enable when needed)');
        results.warnings.push('Reader not enabled');
    }
    
    // Test 5: Try to create WebApi instance
    console.log('\n5. Testing WebApi instantiation...');
    try {
        if (typeof Fingerprint !== 'undefined' && Fingerprint.WebApi) {
            const testSdk = new Fingerprint.WebApi();
            console.log('   ✓ WebApi instance created successfully');
            console.log('   - SDK Version:', testSdk.Version || 'undefined');
            results.passed.push('WebApi instantiation successful');
            
            // Test 6: Try to enumerate devices
            console.log('\n6. Testing device enumeration...');
            testSdk.enumerateDevices().then(
                function(devices) {
                    console.log('   ✓ Device enumeration successful');
                    console.log('   - Devices found:', devices.length);
                    if (devices.length > 0) {
                        devices.forEach((device, idx) => {
                            console.log('   - Device ' + (idx + 1) + ':', device);
                        });
                        results.passed.push('Devices found: ' + devices.length);
                    } else {
                        console.log('   ⚠ No devices found (reader may not be connected)');
                        results.warnings.push('No devices found');
                    }
                    printSummary();
                },
                function(error) {
                    console.log('   ⚠ Device enumeration failed:', error.message);
                    console.log('   This is normal if:');
                    console.log('   - No physical reader is connected');
                    console.log('   - DigitalPersona SDK is not installed');
                    console.log('   - Running in production without reader');
                    results.warnings.push('Device enumeration failed: ' + error.message);
                    printSummary();
                }
            );
        } else {
            console.log('   ✗ Cannot test - Fingerprint.WebApi not available');
            results.failed.push('WebApi not available for testing');
            printSummary();
        }
    } catch (error) {
        console.log('   ✗ Error creating WebApi instance:', error.message);
        results.failed.push('WebApi instantiation failed: ' + error.message);
        printSummary();
    }
    
    function printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('DIAGNOSTIC SUMMARY');
        console.log('='.repeat(60));
        
        console.log('\n✓ PASSED (' + results.passed.length + '):');
        results.passed.forEach(item => console.log('  - ' + item));
        
        if (results.warnings.length > 0) {
            console.log('\n⚠ WARNINGS (' + results.warnings.length + '):');
            results.warnings.forEach(item => console.log('  - ' + item));
        }
        
        if (results.failed.length > 0) {
            console.log('\n✗ FAILED (' + results.failed.length + '):');
            results.failed.forEach(item => console.log('  - ' + item));
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (results.failed.length === 0) {
            console.log('✓ ALL CRITICAL TESTS PASSED');
            console.log('\nYour WebSDK is properly loaded and accessible!');
            
            if (results.warnings.length > 0) {
                console.log('\nNote: Warnings are normal if:');
                console.log('- No physical reader is connected');
                console.log('- Running in production environment');
                console.log('- DigitalPersona SDK not installed');
            }
        } else {
            console.log('✗ SOME TESTS FAILED');
            console.log('\nTroubleshooting:');
            console.log('1. Clear browser cache and reload');
            console.log('2. Check browser console for script loading errors');
            console.log('3. Verify all fingerprint JS files are accessible');
            console.log('4. Check network tab for 404 errors');
        }
        
        console.log('='.repeat(60));
    }
})();
