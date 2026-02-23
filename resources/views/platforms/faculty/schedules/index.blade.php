@extends('layouts.faculty')

@section('content')
    <div class="pagetitle">
        <h1>Management</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item active">Lab Schedules</li>
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
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Date</th>
                                        <th>Book By</th>
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
                            @include ('platforms.faculty.schedules.modal')
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
    @endsection

    @section('javascript')
        <script type="module" src="{{ asset('js/faculty/schedules/index.js') }}"></script>
    @endsection
