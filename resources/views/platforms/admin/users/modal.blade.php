<div class="modal fade" id="main-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="title">Create</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="set-Model" method="POST">
                <input type="hidden" id="role" name="role" value="{{ $role }}">
                <div class="modal-body">

                    <div class="row mb-3">
                        <div class="col-12 col-sm-6 col-lg-3">
                            <label for="fname" class="form-label">First Name*</label>
                            <input name="fname" required type="text" placeholder="First Name"
                                class="form-control  @error('fname') is-invalid @enderror" autocomplete="fname"
                                id="fname">
                        </div>
                        <div class="col-12 col-sm-6 col-lg-3">
                            <label for="mname" class="form-label">Middle Name(optional)</label>
                            <input name="mname" type="text" placeholder="Middle Name"
                                class="form-control  @error('mname') is-invalid @enderror" autocomplete="mname"
                                id="mname">
                        </div>
                        <div class="col-12 col-sm-6 col-lg-3">
                            <label for="lname" class="form-label">Last Name*</label>
                            <input name="lname" required type="text" placeholder="Last Name"
                                class="form-control  @error('lname') is-invalid @enderror" autocomplete="lname"
                                id="lname">
                        </div>
                        <div class="col-12 col-sm-6 col-lg-3">
                            <label for="suffix" class="form-label">Suffix(optional)</label>
                            <select id="suffix" default="" name="suffix"
                                class="form-control  @error('suffix') is-invalid @enderror" autocomplete="suffix">
                                <option value="" selected>Choose...</option>
                                <option value="Sr.">Sr.</option>
                                <option value="Jr.">Jr.</option>
                                <option value="II.">II.</option>
                                <option value="III.">III.</option>
                                <option value="IV.">IV.</option>
                                <option value="V.">V.</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-lg-{{ $role == 'student' ? '4' : '6' }}">
                            <label for="mobile" class="form-label">Mobile*</label>
                            <input type="tel" pattern="09[0-9]{9}" placeholder="09*********" max=11 name="mobile"
                                required class="form-control  " autocomplete="mobile" id="mobile">
                        </div>
                        <div class="col-12 col-lg-{{ $role == 'student' ? '4' : '6' }} ">
                            <label for="is_male" class="form-label">Sex</label>
                            <select required id="is_male" default=1 name="is_male" class="form-control "
                                autocomplete="is_male">
                                <option value=1 selected>Male</option>
                                <option value=0>Female</option>
                            </select>
                        </div>
                        @if ($role == 'student')
                            <div class="col-12 col-lg-4 ">
                                <label for="schoolId" class="form-label">Student Id*</label>
                                <input name="schoolId" required type="text" placeholder="1223-123123"
                                    class="form-control" autocomplete="schoolId" id="schoolId">
                            </div>
                        @endif
                    </div>

                    <div class="col-12 ">
                        <label for="address" class="form-label">Address*</label>
                        <input name="address" required type="text"
                            class="form-control  @error('address') is-invalid @enderror" autocomplete="address"
                            id="address">
                    </div>
                    <div class="row mb-3">

                        <div class="col-12 col-lg-{{ $role == 'faculty' ? '6' : '12' }}">
                            <label for="dob" class="form-label">Date of Birth*</label>
                            <input name="dob" required type="date"
                                max="{{ date('Y-m-d', strtotime('-18 years')) }}"
                                class="form-control  @error('dob') is-invalid @enderror" autocomplete="dob"
                                id="dob">
                        </div>
                        @if ($role == 'faculty')
                            <div class="col-12 col-lg-6 ">
                                <label for="occupation" class="form-label">Occupation*</label>
                                <input name="occupation" required type="text"
                                    class="form-control  @error('occupation') is-invalid @enderror"
                                    autocomplete="occupation" id="occupation">
                            </div>
                        @endif
                    </div>


                    <div class="row mb-3">
                        <div class="col-12 col-lg-{{ $role == 'student' ? '6' : '12' }}">
                            <label for="email" class="form-label">Email*</label>
                            <input name="email" required type="email"
                                class="form-control  @error('email') is-invalid @enderror" autocomplete="email"
                                id="email">
                        </div>
                        @if ($role == 'student')
                            <div class="col-12 col-lg-6">
                                <label for="verified" class="form-label">Verified*</label>
                                <select required id="verified" default="0" name="verified" class="form-control "
                                    autocomplete="verified">
                                    <option value="0" selected>Pending</option>
                                    <option value="1">Approved</option>
                                </select>
                            </div>
                        @endif
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="submit" data-id=0 id="engrave" class="btn btn-primary">Save changes</button>
                </div>
            </form>
        </div>
    </div>
</div>
