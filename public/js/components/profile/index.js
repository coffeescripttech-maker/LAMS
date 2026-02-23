import fetch from "../../fetch.js";

$("#set-Model").on("submit", (e) => {
    state.onStore(e);
});
const state = {
    entity: {
        name: "user",
        attributes: ["name", "section"],
        actions: {
            find: ["fa fa-edit", "Edit", "info"],
            delete: ["fa fa-trash", "Delete", "danger"],
        },
        baseUrl: "../api/changepassword",
    },
    onStore: async (e) => {
        e.preventDefault();
        let params = $("#set-Model").serializeArray();
        let model = await fetch.store(state.entity, params, false);
        if (model.err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                showConfirmButton: false,
                timer: 3000,
                text: model.err,
            });
        }
        if (model.success) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your password has been updated",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#set-Model").trigger("reset");
        }
        document.getElementById("set-Model").reset();
    },
};
window.addEventListener("load", state.init);
