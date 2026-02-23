<div class="modal fade" id="main-modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="title">Create</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="set-Model" method="POST">
                @csrf
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-12">
                            <label for="title" class="form-label">Title</label>
                            <input name="title" required type="text" class="form-control" id="title">
                        </div>
                        <div class="col-12">
                            <label for="description" class="form-label">Description</label>
                            <textarea name="description" required type="textarea" class="form-control" id="description"></textarea>
                        </div>
                    </div>
                    <div class="col-sm-6 col-12 mx-auto  d-flex justify-content-center align-items-center">
                        <div class="input-group mb-3 d-none">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="event" accept="image/png">
                            </div>
                        </div>
                        <div class="img-containter my-2">
                            <img src="{{ asset('img/default.jpg') }}" alt="Event" class="image event"
                                style="width:100%">
                            <div class="middle">
                                <button class="btn btn-info upload" type=button data-id="event"
                                    data-name="SF9">upload</button>
                            </div>
                            <h2 class="text-center">Picture</h2>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" data-id=0 id="engrave" class="btn btn-primary">Save changes</button>
                </div>
            </form>
        </div>
    </div>
</div>
