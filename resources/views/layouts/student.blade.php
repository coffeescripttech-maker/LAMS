<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'LAMS') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

    <!-- Favicons -->
    <link href="{{ asset('img/favicon.png') }}" rel="icon">
    <link href="{{ asset('img/apple-touch-icon.png') }}" rel="apple-touch-icon">

    <!-- Custome CSS Files -->
    <link href="{{ asset('css/student.css') }}" rel="stylesheet" />

    <!-- Google Fonts -->
    <link href="https://fonts.gstatic.com" rel="preconnect" />
    <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Jost:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
        rel="stylesheet" />
    <!-- Vendor CSS Files -->
    <link href="{{ asset('vendor/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/bootstrap-icons/bootstrap-icons.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/boxicons/css/boxicons.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/remixicon/remixicon.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/quill/quill.bubble.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/quill/quill.snow.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/simple-datatables/style.css') }}" rel="stylesheet" />

    <script src="{{ asset('js/jquery.min.js') }}"></script>

    <!-- Sweet alert -->
    <script src="{{ asset('js/sweetalert2.all.min.js') }}"></script>
    <link href="{{ asset('css/sweetalert2.min.css') }}" rel="stylesheet">
    <!-- Template Main CSS File -->
    <link href="{{ asset('css/platform.css') }}" rel="stylesheet" />
    {{-- <link href="{{ asset('css/style.css') }}" rel="stylesheet" /> --}}

</head>

<body>
    <!-- ======= Header ======= -->
    <input type="hidden" value="{{ Auth::user() }}" id="user_id">
    <header id="header" class="header fixed-top d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between">
            <a href="/" class="logo d-flex align-items-center justify-content-center">
                <img src="{{ asset('img/favicon.png') }}" alt="" />
                {{-- <span class="d-none d-lg-block">Bus</span> --}}
            </a>
            <i class="bi bi-chevron-compact-right toggle-sidebar-btn"></i>
        </div>
        <!-- End Logo -->

        <div class="search-bar">
            <div class="search-form d-flex align-items-center">
                <input type="text" id="key" placeholder="Search" title="Enter search keyword" />
                <button type="button" id="search" title="Search">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </div>
        <!-- End Search Bar -->

        <nav class="header-nav ms-auto">
            <ul class="d-flex align-items-center">
                <li class="nav-item d-block d-lg-none">
                    <a class="nav-link nav-icon search-bar-toggle" href="#">
                        <i class="bi bi-search"></i>
                    </a>
                </li>
                <!-- End Search Icon-->

                <li class="nav-item d-flex dropdown pe-3">
                    <a href="{{ url('/user/profile') }}">
                        <i class="bi bi-person-circle" style="font-size: 40px"></i>
                    </a>
                    <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#"
                        data-bs-toggle="dropdown">
                        <span class="d-none d-md-block dropdown-toggle ps-2 text-capitalize">
                            {{ Auth::user()->fname }}</span>
                    </a>
                    <!-- End Profile Iamge Icon -->

                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                        <li class="dropdown-header">
                            <h6 class="text-capitalize">{{ Auth::user()->lname }}, {{ Auth::user()->fname }}</h6>
                            <span>{{ Auth::user()->role }}</span>
                        </li>
                        <li>
                            <hr class="dropdown-divider" />
                        </li>

                        {{-- <li>
                            <a class="dropdown-item d-flex align-items-center" href="{{ url('/user/profile') }}">
                        <i class="bi bi-person"></i>
                        <span>My Profile</span>
                        </a>
                </li> --}}
                        <li>
                            <hr class="dropdown-divider" />
                        </li>
                        <li>
                            <hr class="dropdown-divider" />
                        </li>

                        <li>
                            <a class="dropdown-item d-flex align-items-center" href="{{ route('logout') }}"
                                onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                <i class="bi bi-box-arrow-right"></i>
                                <span>Sign Out</span>
                            </a>
                        </li>
                        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                            @csrf
                        </form>
                    </ul>

                    <!-- End Profile Dropdown Items -->
                </li>
                <!-- End Profile Nav -->
            </ul>
        </nav>
        <!-- End Icons Navigation -->
    </header>
    <!-- End Header -->
    <!-- ======= Sidebar ======= -->
    <aside id="sidebar" class="sidebar">
        <ul class="sidebar-nav" id="sidebar-nav">
            <li class="nav-item">
                <a class="nav-link collapsed" href="{{ url('/student/dashboard') }}" id="dashboard"
                    data-name="dashboard">
                    <i class="bi bi-grid"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            <li class="nav-heading">Laboratory</li>
            <li class="nav-item">
                <a class="nav-link collapsed" id="availables"
                    data-name="availables"href="{{ url('/student/availables') }}">
                    <i class="ri-checkbox-circle-fill"></i>
                    <span>Availables</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link collapsed" id="attendances" data-name="attendances"
                    href="{{ url('/student/attendances') }}">
                    <i class="ri-calendar-check-line"></i>
                    <span>Attendance Record</span>
                </a>
            </li>
        </ul>
        </li><!-- End Charts Nav -->


        <!-- End Dashboard Nav -->

        </ul>
    </aside>
    <!-- End Sidebar-->

    <main id="main" class="main">
        @yield('content')
    </main>
    <!-- End #main -->

    <!-- Vendor JS Files -->
    @yield('javascript')
    <script src="{{ asset('vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('vendor/chart.js/chart.umd.js') }}"></script>
    <script src="{{ asset('vendor/echarts/echarts.min.js') }}"></script>
    <script src="{{ asset('vendor/quill/quill.min.js') }}"></script>
    <script src="{{ asset('vendor/simple-datatables/simple-datatables.js') }}"></script>
    <script src="{{ asset('vendor/tinymce/tinymce.min.js') }}"></script>
    <script src="{{ asset('vendor/apexcharts/apexcharts.min.js') }}"></script>
    <!-- Library Plugin-->
    <script defer src="https://cdn.datatables.net/1.13.3/js/jquery.dataTables.min.js"></script>
    <script defer src="https://cdn.datatables.net/1.13.3/js/dataTables.bootstrap5.min.js"></script>
    <!-- Template Main JS File -->
    <script src="{{ asset('js/platform.js') }}"></script>
    <script>
        var a = $("a");
        for (var i = 0; i < a.length; i++) {
            if (a[i].getAttribute("data-name") === window.location.href.split('/').pop()) {
                document.getElementById(window.location.href.split('/').pop()).className = "nav-link"
            }
        }
    </script>
</body>

</html>
