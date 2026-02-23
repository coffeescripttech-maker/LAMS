@extends('layouts.admin')

@section('content')
    <div class="pagetitle">
        <h1>Management</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item active">Reservations</li>
            </ol>
        </nav>
    </div>
    <!-- End Page Title -->
    <div class="section dashboard">
        <div class="row">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-12">
                        <div class="card-body pb-0">
                            <div class="d-flex justify-content-end mb-5">
                                <button class="btn btn-success rounded" id="btn-new" data-bs-toggle="modal"
                                    data-bs-target="#main-modal"><i class="bi bi-plus-circle-dotted"></i></button>
                            </div>
                            <table id="example" class="table table-striped table-bordered table-sm mb-3" cellspacing="0">
                                <thead class="dhead">
                                    <tr>
                                        <th style="width:10%">No.</th>
                                        <th>Faculty name</th>
                                        <th>Schedule</th>
                                        <th>Status</th>
                                        <th style="width:20%">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="dbody" id="tbody">
                                </tbody>
                            </table>
                            <div class="d-flex justify-content-center" id="loading">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            @include ('platforms.admin.reservations.modal')
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
    @endsection

    @section('javascript')
        <script type="module" src="{{ asset('js/admin/reservations/index.js') }}"></script>
    @endsection
