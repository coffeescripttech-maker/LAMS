<div class="modal fade" id="fingerprint-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="fingerprint-modal-title">Fingerprint Enrollment</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <!-- Reader Status Alert -->
            <div id="reader-status-alert" class="alert alert-info mx-3 mt-3 mb-0" style="display: none;">
                <div class="d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status" id="reader-spinner">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div>
                        <strong id="reader-status-title">Initializing...</strong>
                        <p class="mb-0 small" id="reader-status-message">Checking for fingerprint reader...</p>
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="progress mx-3 mt-3" style="height: 25px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" id="progress" 
                     style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
            </div>

            <form id="set-Model" method="POST">
                <div class="modal-body">
                    <div id="content-capture">
                        <!-- Status Messages -->
                        <div id="status" class="alert alert-secondary text-center py-2 mb-3" style="display: none;"></div>
                        
                        <!-- Fingerprint Image Display -->
                        <div id="imagediv" class="text-center"></div>

                        <!-- Instructions -->
                        <div id="instructions" class="alert alert-light mt-3">
                            <h6 class="alert-heading"><i class="bi bi-info-circle"></i> Instructions:</h6>
                            <ol class="mb-0 small">
                                <li>Place your finger firmly on the fingerprint reader</li>
                                <li>Keep your finger still until the image appears</li>
                                <li>Click "Next" to capture the next scan</li>
                                <li>Repeat 5 times (use the same finger)</li>
                                <li>Click "Save" after all 5 scans are complete</li>
                            </ol>
                        </div>

                        <!-- Debug Console (collapsible) -->
                        <div class="accordion mt-3" id="debugAccordion">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                            data-bs-target="#debugConsole" aria-expanded="false">
                                        <i class="bi bi-terminal"></i> Debug Console
                                    </button>
                                </h2>
                                <div id="debugConsole" class="accordion-collapse collapse" data-bs-parent="#debugAccordion">
                                    <div class="accordion-body">
                                        <div id="debug-log" class="bg-dark text-light p-2 rounded" 
                                             style="max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px;">
                                            <div class="text-success">Debug console initialized...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-info" id="fingerprint" type="button" disabled>
                        <span id="fingerprint-btn-text">Initializing...</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
