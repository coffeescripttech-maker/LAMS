<div class="modal fade" id="main-modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="title">Create</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="set-Model" method="POST">
                @csrf
                <div class="modal-body" id="modal-body-schedule">

                </div>
                <div class="modal-footer">
                    <button type="submit" data-id=0 id="engrave" class="btn btn-primary">Save changes</button>
                </div>
            </form>
        </div>
    </div>
</div>
