<div class="modal fade" id="fingerprint-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="title">Create</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="progress mx-3">
                <div class="progress-bar" role="progressbar" id="progress" style="width: 0%" aria-valuenow="0"
                    aria-valuemin="0" aria-valuemax="0">0%</div>
            </div>
            <form id="set-Model" method="POST">
                <div class="modal-body">
                    <div id="content-capture">
                        <div id="status"></div>
                        <div id="imagediv"></div>

                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-info" id="fingerprint" type="button">Next</button>
                </div>
            </form>
        </div>
    </div>
</div>
