<div class="modal fade" id="register" tabindex="-1" aria-labelledby="register" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="register">Register</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form method="POST" action="{{ route('register') }}">
                <div class="modal-body">
                    <div id="error-register" class="d-none">

                        @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                        @endif
                    </div>
                    @csrf
                    <div class="row mb-3">
                        <div class="col-12 col-md-6 col-lg-3">
                            <label for="fname" class="form-label">First Name*</label>
                            <input name="fname" required type="text" placeholder="First Name"
                                class="form-control  @error('fname') is-invalid @enderror" autocomplete="fname" value="{{ old('fname') }}"
                                id="fname">
                            @error('fname')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        <div class="col-12 col-md-6 col-lg-3">
                            <label for="mname" class="form-label">Middle Name(optional)</label>
                            <input name="mname" type="text" placeholder="Middle Name"
                                class="form-control  @error('mname') is-invalid @enderror" autocomplete="mname" value="{{ old('mname') }}"
                                id="mname">
                            @error('mname')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        <div class="col-12 col-md-6 col-lg-3">
                            <label for="lname" class="form-label">Last Name*</label>
                            <input name="lname" required type="text" placeholder="Last Name"
                                class="form-control  @error('lname') is-invalid @enderror" autocomplete="lname" value="{{ old('lname') }}"
                                id="lname">
                            @error('lname')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        <div class="col-12 col-md-6 col-lg-3">
                            <label for="suffix" class="form-label">Suffix(optional)</label>
                            <select id="suffix" default="" name="suffix"
                                class="form-control  @error('suffix') is-invalid @enderror" autocomplete="suffix" value="{{ old('suffix') }}">
                                <option value="" disabled selected>Choose...</option>
                                <option value="Sr.">Sr.</option>
                                <option value="Jr.">Jr.</option>
                                <option value="II.">II.</option>
                                <option value="III.">III.</option>
                                <option value="IV.">IV.</option>
                                <option value="V.">V.</option>
                            </select>
                            @error('suffix')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="dob" class="form-label">Date of Birth</label>
                            <input type="date" name="dob" max="<?php echo explode(" ", Carbon\Carbon::now('Asia/Singapore')->subYear(18))[0] ?>"
                                class="form-control  @error('dob') is-invalid @enderror" autocomplete="dob" value="{{ old('dob') }}"
                                id="dob">

                            @error('dob')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        <div class="col-6">
                            <label for="mobile" class="form-label">Mobile*</label>
                            <input type="tel" pattern="09[0-9]{9}" name="mobile" required
                                class="form-control  @error('mobile') is-invalid @enderror" autocomplete="mobile" value="{{ old('mobile') }}"
                                id="mobile">

                            @error('mobile')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>

                        <div class="col-12">
                            <label for="address" class="form-label">Address*</label>
                            <input type="text" name="address" required
                                class="form-control  @error('address') is-invalid @enderror" autocomplete="address" value="{{ old('address') }}"
                                id="address">

                            @error('address')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="col-12">
                        <label for="schoolId" class="form-label">School ID</label>
                        <input type="text" name="schoolId"
                            class="form-control  @error('schoolId') is-invalid @enderror" autocomplete="schoolId" value="{{ old('schoolId') }}"
                            id="schoolId">

                        @error('schoolId')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="col-12">
                        <label for="occupation" class="form-label">Occupation</label>
                        <input type="text" name="occupation"
                            class="form-control  @error('occupation') is-invalid @enderror" autocomplete="occupation" value="{{ old('occupation') }}"
                            id="occupation">

                        @error('occupation')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>

                    <div class="col-12 ">
                        <label for="is_male" class="form-label">Sex</label>
                        <select required id="is_male" default=1 name="is_male"
                            class="form-control  @error('is_male') is-invalid @enderror" autocomplete="is_male" value="{{ old('is_male') }}">
                            <option value=1 selected>Male</option>
                            <option value=0>Female</option>
                        </select>
                        @error('is_male')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="row mb-3">
                        <div class="col-12">
                            <label for="email" class="form-label">Email*</label>
                            <input name="email" required type="text" class="form-control  " autocomplete="email" value="{{ old('email') }}"
                                id="email">


                        </div>
                    </div>

                    <div class="row mb-3">
                        <label for="password" class="col-md-4 col-form-label text-md-end">{{ __('Password*') }}</label>

                        <div class="col-md-6">
                            <input id="password" type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                                class="form-control @error('password') is-invalid @enderror" name="password" required

                                autocomplete="new-password" value="{{ old('password') }}">


                            @error('password')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label for="password-confirm"
                            class="col-md-4 col-form-label text-md-end">{{ __('Confirm Password*') }}</label>

                        <div class="col-md-6">
                            <input id="password-confirm" type="password" class="form-control"
                                name="password_confirmation" required autocomplete="password_confirmation" value="{{ old('password_confirmation') }}">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6 offset-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" required name="remember"
                                    id="remember" {{ old('remember') ? 'checked' : '' }}>

                                <label onclick="terms()" class="form-check-label" for="remember">
                                    {{ __('I agree all statements in Terms of service
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ') }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">
                        {{ __('Register') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
    @include('auth/modal/terms')
</div>

<script>
    function terms() {
        $("#terms").modal("show");
    }
</script>