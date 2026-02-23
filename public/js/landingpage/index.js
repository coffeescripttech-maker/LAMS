import fetch from "./../fetch.js";
$("body").on("click", ".auth", async (e) => {
    state.handleActiveModal($(e.currentTarget).data("bs-target"));
});
const state = {
    routes: [],
    types: [],
    isRegister: "",
    form: document.getElementById("form"),
    init: async () => {
        state.handleCounter();
        if ($("#error").val()) {
            const register = localStorage.getItem("register");
            if (register === "true") {
                $("#register").modal("show");
                $("#error-register").removeClass("d-none");
                $("#error-login").addClass("d-none");
                //                 await $("#error-register").html(`

                // @if ($errors->any())
                //     <div class="alert alert-danger">
                //         <ul>
                //             @foreach ($errors->all() as $error)
                //                 <li>{{ $error }}</li>
                //             @endforeach
                //         </ul>
                //     </div>
                // @endif`);
            }
            if (register === "false") {
                $("#exampleModal").modal("show");
                $("#error-login").removeClass("d-none");
                $("#error-register").addClass("d-none");
                //                 await $("#error-login").html(`

                // @if ($errors->any())
                //     <div class="alert alert-danger">
                //         <ul>
                //             @foreach ($errors->all() as $error)
                //                 <li>{{ $error }}</li>
                //             @endforeach
                //         </ul>
                //     </div>
                // @endif`);
            }
        }

        // state.form.addEventListener("submit", state.handleMailer);
        state.form.disable = false;
        state.routes = await fetch.ask("./api/landing/routes");
        state.types = await fetch.ask("./api/landing/types");
        await state.handleWriterRoutes();
        await state.handleWriterTypes();
    },
    handleActiveModal: (auth) => {
        if (auth === "#register") {
            localStorage.setItem("register", true);
        } else {
            localStorage.setItem("register", false);
        }
    },
    handleMailer: async (e) => {
        e.preventDefault();
        $("#send").attr("disabled", "disabled");

        let params = $("#form").serializeArray();
        let model = await fetch.store(
            { baseUrl: "./api", name: "mailer" },
            params
        );
        if (model) {
            $("#send").removeAttr("disabled", false);
        }
        $("form").trigger("reset");
    },
    handleWriterRoutes: async () => {
        var html = "";
        await state.routes.forEach((route, index) => {
            html += ` <div class="carousel-item ${index === 1 && "active"}">
               <div class="carousel-container image-container">
                   <h2 class="animate__animated animate__fadeInDown">
                       ${route.name}
                   </h2>
                   ${
                       route.has_image
                           ? ` <img
                           class="animate__animated animate__fadeInDown route-image"
                           src="${
                               window.location.protocol +
                               "//" +
                               window.location.host
                           }/storage/routes/${route.id}.png"
                           alt=""
                       />`
                           : ""
                   }
                      
                   <p class="animate__animated animate__fadeInUp overlay-text">
                       ${route.description}
                   </p>
                   <a
                       href="${route.link}"
                       class="btn-get-started animate__animated animate__fadeInUp scrollto"
                       >Read More</a
                   >
               </div>
           </div>`;
        });
        await $("#heroCarousel").html(html);
        $("#heroCarousel").append(`

            <a class="carousel-control-prev" href="#heroCarousel" role="button" data-bs-slide="prev">
                <span class="carousel-control-prev-icon bx bx-chevron-left" aria-hidden="true"></span>
            </a>

            <a class="carousel-control-next" href="#heroCarousel" role="button" data-bs-slide="next">
                <span class="carousel-control-next-icon bx bx-chevron-right" aria-hidden="true"></span>
            </a>`);
    },
    handleWriterTypes: async () => {
        await state.types.forEach(async (type) => {
            let con = $("<div>", {
                class: "col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0",
                "data-aos": "fade-up",
            });
            let box = $("<div>", {
                class: "icon-box",
                "data-aos": "fade-up",
            });
            $("<div>", {
                class: "icon",
                html: `<i class="bx bxs-bus">`,
            }).appendTo(box);
            $("<div>", {
                class: "title",
                html: `<a href="">${type.name}</a>`,
            }).appendTo(box);
            let p = $("<p>", { class: "description" });
            let ul = $("<ul>", { class: "list-unstyled" });
            type.description.split("|").forEach((d) => {
                $("<li>", {
                    html: `<i class="ri-check-double-line"></i>
                               ${d}`,
                }).appendTo(ul);
            });
            p.append(ul);
            box.append(p);
            con.append(box);
            $("#types").append(con);
        });
    },

    handleCounter: async () => {
        fetch.ask("./api/dashboard").then((model) => {
            console.log(model);
            $("#users-total").attr(
                "data-purecounter-end",
                Number(model.student) + Number(model.faculty)
            );

            $("#students-total").attr("data-purecounter-end", model.student);
            $("#faculty-total").attr("data-purecounter-end", model.faculty);
            $("#total-logs").attr(
                "data-purecounter-end",
                Number(model.all_reservations)
            );
        });
    },
};

window.addEventListener("load", state.init);
