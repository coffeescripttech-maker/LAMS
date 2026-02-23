@extends('layouts.app')

@section('content')
    <script>
        // Pass fingerprint API URL from Laravel config to JavaScript
        window.FINGERPRINT_API_URL = "{{ config('fingerprint.api_url') }}";
    </script>
    
    <div class="container-fluid w-100">
        <div class="row justify-content-center">
            <div class="col-md-5 col-12" id="card">
                {{-- <div class="card">
                    <div class="card-header bg-success text-white ">
                        IN
                    </div>
                    <div class="card-body d-flex justify-content-center flex-column align-items-center ">
                        <img src="{{ asset('img/team/team-1.jpg') }}" class="card-img-top" alt="Profile Image"
                            onerror="this.onerror=null;this.src='{{ asset('img/team/team-2.jpg') }}';"
                            style="width: 400px; height: 400px;">
                        <div class="text-start bg-light w-100 px-2 rounded  mt-2 p-3">
                            <h1>Jon Doe</h1>
                            <p class="card-text">SECTION 1.</p>
                            <h2 class="card-text">Computer No: 404</h2>
                        </div>
                    </div>
                </div> --}}
            </div>

            <div class="col-md-7 col-12">
                <div class="card ">
                    <div class="card-header">
                        Attendance Table
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <span class="badge bg-success px-3">IN</span>
                                <span class="badge bg-danger px-3">OUT</span>
                            </div>
                            <div>
                                <button class="btn btn-info rounded" id="non-ecoast" data-bs-toggle="modal"
                                    data-bs-target="#main-modal">
                                    Non-Ecoast
                                </button>
                            </div>
                        </div>
                        <div class="table-responsive" style="max-height: 60vh; overflow-y: auto;">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Section</th>
                                        <th scope="col">Computer No.</th>
                                        <th scope="col">Time In</th>
                                        <th scope="col">Time Out</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="text-white" id="tbody">

                                </tbody>
                            </table>
                        </div>
                    </div>
                    @include('attendance.modal')
                    @include('attendance.com')
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ asset('js/fingerprint/es6-shim.js') }}"></script>
    <script src="{{ asset('js/fingerprint/websdk.client.bundle.min.js') }}"></script>
    <script src="{{ asset('js/fingerprint/fingerprint.sdk.min.js') }}"></script>
    <script src="{{ asset('js/fingerprint/attendance.js') }}"></script>
    <script type="module" src="{{ asset('js/landingpage/attendance.js') }}"></script>
@endsection
