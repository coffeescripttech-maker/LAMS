@extends('layouts.student')

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
                            @include ('platforms.student.attendances.modal')
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
    @endsection

    @section('javascript')
        <script type="module" src="{{ asset('js/student/attendances/index.js') }}"></script>
    @endsection
