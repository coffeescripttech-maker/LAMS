// Chart.js placeholder - will be replaced with actual library
console.log('Chart.js loaded');

// Basic Chart.js stub for compatibility
if (typeof window !== 'undefined') {
    window.Chart = window.Chart || {
        register: function() {},
        Chart: function() {
            return {
                update: function() {},
                destroy: function() {},
                render: function() {}
            };
        }
    };
}

// Load Chart.js from CDN as fallback
(function() {
    if (typeof Chart === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
        script.onload = function() {
            console.log('Chart.js loaded from CDN');
        };
        document.head.appendChild(script);
    }
})();