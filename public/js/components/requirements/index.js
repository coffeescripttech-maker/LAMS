import fetch from "../../fetch.js";
$("body").on("click", ".upload", async (e) => {
    state.handleFolder(
        $(e.currentTarget).data("id"),
        $(e.currentTarget).data("name")
    );
});
$("body").on("change", ".custom-file-input", async (e) => {
    state.handleUpload(e.target.files);
});
$("body").on("click", ".img-containter", async (e) => {
    state.handleModal($(e.currentTarget).data("name"));
});

const state = {
    entity: {
        name: "credential",
        baseUrl: "../api",
    },

    models: [],
    user: JSON.parse($("#user_id").val()),
    btnUpdate: null,
    btnDelete: null,
    target: "",
    name: "",
    init: async () => {
        await state.ask();
    },
    ask: async () => {},
    handleModal: (name) => {
        $(`#image-modal`).attr(
            "src",
            `https://lams-1-njuv.onrender.com/storage/credentials/${state.user.email}/${name}.png`
        );
        $("#main-modal").modal("show");
    },

    handleFolder: (target, name) => {
        state.target = target;
        state.name = name;
        $(`#${target}`).click();
    },

    handleUpload: async (files) => {
        if (files && files[0]) {
            if (files[0].name.split(".").pop() !== "png") {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    showConfirmButton: false,
                    timer: 3000,
                    text: "only PNG",
                });
                return;
            }
            var params = [
                { name: "name", value: state.target },
                { name: "student_id", value: state.user.id },
                { name: "email", value: state.user.email },
                { name: "display_name", value: state.name },
            ];
            var img = document.querySelector(`.${state.target}`);
            var reader = new FileReader();

            reader.onloadend = async () => {
                await params.push({
                    name: "file_base64",
                    value: reader.result,
                });
                await fetch.store(
                    { baseUrl: "../../api", name: "users/profile" },
                    params
                );
                // state.ask();
            };
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            };
            reader.readAsDataURL(files[0]);
            img.src = URL.createObjectURL(files[0]);
        }
    },
};
window.addEventListener("load", state.init);
