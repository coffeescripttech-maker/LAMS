@extends('layouts.admin')

@section('content')
    <div class="pagetitle">
        <h1>Dashboard</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item active">Dashboard</li>
            </ol>
        </nav>
    </div>
    <!-- End Page Title -->

    <section class="section dashboard">
        <div class="row" id="parent">
            <!-- Left side columns -->
            <div class="col-12">
                <div class="row">


                    <!-- Customers Card -->
                    <div class="col-md-6">
                        <div class="card info-card customers-card">

                            <div class="card-body">
                                <h5 class="card-title">Total Faculty</h5>


                                <div class="d-flex align-items-center">
                                    <div
                                        class="card-icon rounded-circle d-flex align-items-center justify-content-center bg-info">
                                        <i class="ri-user-star-line"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6 id="faculty-data">0</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class=" col-md-6">
                        <div class="card info-card customers-card">

                            <div class="card-body">
                                <h5 class="card-title">Total Students</h5>


                                <div class="d-flex align-items-center">
                                    <div
                                        class="card-icon rounded-circle d-flex align-items-center justify-content-center bg-primary">
                                        <i class="ri-user-shared-line"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6 id="student-data">0</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xxl-4 col-md-6">
                        <div class="card info-card customers-card reservations" data-status="pending">

                            <div class="card-body">
                                <h5 class="card-title">Reservations Pending</h5>


                                <div class="d-flex align-items-center">
                                    <div
                                        class="card-icon rounded-circle d-flex align-items-center justify-content-center bg-warning">
                                        <i class="ri-error-warning-line"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6 id="reservations_pending-data">0</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- End Sales Card -->
                    <div class="col-xxl-4 col-md-6">
                        <div class="card info-card revenue-card reservations" data-status="approved">
                            <div class="card-body">
                                <h5 class="card-title">Reservations Approved</h5>
                                <div class="d-flex align-items-center">
                                    <div
                                        class="card-icon rounded-circle d-flex align-items-center justify-content-center bg-success">
                                        <i class="ri-check-fill text-info"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6 id="reservations_approved-data">0</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 col-xxl-4">
                        <div class="card info-card sales-card">
                            <div class="card-body">
                                <h5 class="card-title">Reservations Rejected</h5>
                                <div class="d-flex align-items-center">
                                    <div
                                        class="card-icon rounded-circle d-flex align-items-center justify-content-center bg-danger">
                                        <i class="ri-close-fill"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6 id="reservations_rejected-data">0</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-8">
                        <div class="card top-selling overflow-auto">
                            {{-- <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i
                                        class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li class="dropdown-item" data-value="pending">Pending</li>
                                    <li class="dropdown-item" data-value="ongoing">Ongoing</li>
                                    <li class="dropdown-item" data-value="success">Success</li>
                                    <li class="dropdown-item" data-value="rejected">Rejected</li>
                                    <li class="dropdown-item" data-value="deleted">Deleted</li>
                                </ul>
                            </div> --}}

                            <div class="card-body pb-0">
                                <h5 class="card-title">Reservations List</h5>

                                <table class="table table-borderless " style="max-height:400px;">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Reservation ID</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Requested by</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody">

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">

                        <!-- Website Traffic -->
                        <div class="card">

                            <div class="card-body pb-0">
                                <h5 class="card-title">Reservations</h5>

                                <div id="trafficChart" style="min-height: 500px;" class="echart"></div>


                            </div>
                        </div><!-- End Website Traffic -->

                    </div>
                    <!-- End Top Selling -->
                </div>
            </div>
            <!-- End Left side columns -->


        </div>
    </section>
@endsection

@section('javascript')
    <script type="module" src="{{ asset('js/admin/dashboard/index.js') }}"></script>
@endsection
