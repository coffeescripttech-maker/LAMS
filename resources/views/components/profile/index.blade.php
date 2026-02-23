@extends('layouts.' . Auth::user()->role)
@section('content')
    <div class="pagetitle">
        <h1>Profile</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">Home</a></li>
                <li class="breadcrumb-item">Users</li>
                <li class="breadcrumb-item active">Profile</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section profile">
        <div class="row">
            @include ('components.profile.cardProfile')


            <div class="col-xl-8">

                <div class="card">
                    <div class="card-body pt-3">
                        <!-- Bordered Tabs -->
                        <ul class="nav nav-tabs nav-tabs-bordered">
                            <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab"
                                    data-bs-target="#profile-change-password">Change Password</button>
                            </li>

                        </ul>
                        <div class="tab-content pt-2">


                            <div class="tab-pane fade fade show active pt-3 " id="profile-change-password">
                                <!-- Change Password Form -->
                                <form id="set-Model">
                                    <input type="hidden" name="id" value="{{ Auth::user()->id }}">
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label for="oldPasswordInput" class="form-label">Old Password</label>
                                            <input minlength="8" required name="old_password" type="password"
                                                class="form-control @error('old_password') is-invalid @enderror"
                                                id="oldPasswordInput" placeholder="Old Password">
                                        </div>
                                        <div class="mb-3">
                                            <label for="newPasswordInput" class="form-label">New Password</label>
                                            <input minlength="8" required name="new_password" type="password"
                                                class="form-control @error('new_password') is-invalid @enderror"
                                                id="newPasswordInput" placeholder="New Password">
                                        </div>
                                        <div class="mb-3">
                                            <label for="confirmNewPasswordInput" class="form-label">Confirm New
                                                Password</label>
                                            <input minlength="8" required name="new_password_confirmation" type="password"
                                                class="form-control" id="confirmNewPasswordInput"
                                                placeholder="Confirm New Password">
                                        </div>

                                    </div>

                                    <div class="card-footer">
                                        <button class="btn btn-success">Submit</button>
                                    </div>

                                    {{-- </form>
                                <form>

                                    <div class="row mb-3">
                                        <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label">Current
                                            Password</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="password" type="password" class="form-control"
                                                id="currentPassword">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="newPassword" class="col-md-4 col-lg-3 col-form-label">New
                                            Password</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="newpassword" type="password" class="form-control" id="newPassword">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label">Re-enter New
                                            Password</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="renewpassword" type="password" class="form-control"
                                                id="renewPassword">
                                        </div>
                                    </div>

                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary">Change Password</button>
                                    </div>
                                </form><!-- End Change Password Form --> --}}

                            </div>

                        </div><!-- End Bordered Tabs -->

                    </div>
                </div>

            </div>
        </div>
    </section>
@endsection

@section('javascript')
    <script type="module" src="{{ asset('js/components/profile/index.js') }}"></script>
    <script type="module" src="{{ asset('js/components/requirements/index.js') }}"></script>
@endsection
