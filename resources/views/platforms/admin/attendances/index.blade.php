@extends('layouts.admin')

@section('content')
    <div class="pagetitle">
        <h1>Management</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item active">Attendances</li>
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
                                <button class="btn btn-info rounded" id="export"><i
                                        class="bi bi-file-earmark-excel-fill"></i></button>
                            </div>
                            <div>
                                <div class="d-flex justify-content-between">
                                    <div class="row  w-100 p-2">
                                        <div class="col-md-3">

                                            <select name="sections" id="sections-list" class="form-select salain"
                                                data-key="section_name">
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <input name="date" required type="date" class="form-control salain"
                                                id="date" data-key="date">
                                        </div>
                                        <div class="col-md-3">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">Start</span>
                                                <input name="time" required type="time" class="form-control salain"
                                                    id="startTime" data-key="start">
                                            </div>


                                        </div>
                                        <div class="col-md-3">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">End</span>
                                                <input name="time" required type="time" class="form-control salain"
                                                    id="endTime" data-key="end">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table id="example" class="table table-striped table-bordered table-sm mb-3" cellspacing="0">
                                <thead class="dhead">
                                    <tr>
                                        <th style="width:10%">No.</th>
                                        <th>Student Name</th>
                                        <th>Section</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                        <th>Computer No.</th>
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
                            @include ('platforms.admin.attendances.modal')
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
    @endsection

    @section('javascript')
        <script type="module" src="{{ asset('js/admin/attendances/index.js') }}"></script>
    @endsection
