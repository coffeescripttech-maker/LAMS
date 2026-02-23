@extends('layouts.faculty')

@section('content')
<div class="pagetitle">
    <h1>Dashboard</h1>
    <nav>
        <!-- <ol class="breadcrumb">
                                                                <li class="breadcrumb-item"><a href="{{ url('faculty/dashboard') }}">Home</a></li>
                                                                <li class="breadcrumb-item active">Dashboard</li>
                                                              </ol> -->
    </nav>
</div>
<!-- End Page Title -->


@if(Auth::user()->deleted_at == NULL)
<div class="container" id="container">
</div>
@else
<div class="vh-100 d-flex justify-content-center align-items-center">
    <h1 class="bg-danger p-5">
        Your account was banned
    </h1>
</div>
@endif
@include ('platforms.faculty.dashboard.comments')
@endsection

@section('javascript')
<script type="module" src="{{ asset('js/faculty/dashboard/index.js') }}"></script>
@endsection