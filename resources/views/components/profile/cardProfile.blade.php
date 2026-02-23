 <div class="col-xl-4">

     <div class="card">
         <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
             <?php
             $img = 'storage/credentials/' . Auth::user()->email . '/avatar.png';
             ?>
             <div class="col-md-6 col-12 mx-auto  d-flex justify-content-center align-items-center">
                 <div class="input-group mb-3 d-none">
                     <div class="custom-file">
                         <input type="file" class="custom-file-input" id="avatar" accept="image/png">
                     </div>
                 </div>
                 <div class="img-containter">
                     <img src="{{ asset($img) }}" onerror="this.src='{{ asset('img/default.jpg') }}'" alt="Avatar"
                         class="image avatar rounded-circle" style="width:100%">
                     <div class="middle">
                         <button class="btn btn-info upload" data-id="avatar" data-name="avatar">upload</button>
                     </div>
                 </div>
             </div>
             <h2 class="text-capitalize">{{ Auth::user()->fullName }}</h2>
             <h3>{{ Auth::user()->role }}</h3>
             @if (Auth::user()->status == 'enrolled')
                 <h4 class="text-center">
                     {{ Auth::user()->section_details->track_details->name . '-' . Auth::user()->section_details->name }}
                 </h4>
             @endif
         </div>
     </div>

 </div>
