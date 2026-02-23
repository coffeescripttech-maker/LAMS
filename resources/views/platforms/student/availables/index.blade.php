@extends('layouts.student')

@section('content')
    <div class="pagetitle">
        <h1>Management</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item active">Availables</li>
            </ol>
        </nav>
    </div>
    <!-- End Page Title -->
    <div class="section dashboard">
        <div class="row g-4" id="row-card">

        </div>
    </div>
    </section>
@endsection

@section('javascript')
    <script type="module" src="{{ asset('js/student/availables/index.js') }}"></script>
@endsection
