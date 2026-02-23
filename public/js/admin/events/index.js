import fetch from "../../fetch.js";
$("body").on("keydown", "#key", async (e) => {
    if (e.key === "Enter") {
        state.handleSearch(e.target.value);
    }
});
$("body").on("click", "#search", async (e) => {
    state.handleSearch($("#key").val());
});
$("body").on("click", ".edit-btn", async (e) => {
    state.onShow($(e.currentTarget).data("index"));
});
$("body").on("click", ".btn-delete", async (e) =>
    state.onDestroy($(e.currentTarget).data("index"))
);
$("body").on("click", ".comment-btn", async (e) =>
    state.handleShowComment($(e.currentTarget).data("index"))
);
$("body").on("click", ".btn-delete-comment", async (e) =>
    state.handleDeleteComment($(e.currentTarget).data("index"))
);

$("body").on("click", ".upload", async (e) => state.handleFolder());

$("body").on("change", ".custom-file-input", async (e) => {
    state.handleUpload(e.target.files);
});
const state = {
    entity: {
        name: "event",
        attributes: ["name", "section"],
        actions: {
            find: ["fa fa-edit", "Edit", "info"],
            delete: ["fa fa-trash", "Delete", "danger"],
        },
        baseUrl: "../api",
    },

    models: [],
    organizers: [],
    criteria: [],
    activeIndex: 0,
    btnUpdate: null,
    btnEngrave: document.getElementById("engrave"),
    btnUpdate: null,
    btnDelete: null,
    base64: {},
    file: {},
    btnNew: document.getElementById("btn-new"),
    formSubmit: document.getElementById("set-Model"),
    init: async () => {
        state.formSubmit.addEventListener("submit", state.onStore);
        state.formSubmit.disable = false;
        state.btnNew.addEventListener("click", state.onCreate);
        state.btnNew.disable = false;

        await state.ask();
    },
    handleSearch: async (val) => {
        $("#loading").css("visibility", "show");
        $("#example").DataTable().destroy();
        $("#tbody").empty();
        let models = await fetch.globalSearch(state.models, val);
        if (models) {
            await models.forEach(
                async (model, i) => await state.writter(model, i)
            );
        }
        $("#example").DataTable({ searching: false });
        $("#loading").css("visibility", "hidden");
    },
    ask: async () => {
        $("#loading").css("visibility", "show");
        $("#example").DataTable().destroy();
        $("#tbody").empty();
        state.models = await fetch.translate(state.entity);
        if (state.models)
            await state.models.forEach(
                async (model, i) => await state.writter(model, i)
            );
        $("#example").DataTable({ searching: false });
        $("#loading").css("visibility", "hidden");
    },

    writter: async (model, i) => {
        let tr = $("<tr>", {
            class: `${(i + 1) % 2 == 1 ? "odd" : "even"}`,
            id: `model-${model.id}`,
        });
        $("<td>", { scope: "row", html: i + 1 }).appendTo(tr);
        $("<td>", { html: model.title, class: "text-capitalize" }).appendTo(tr);
        var tdd = $("<td>", { width: "200" });
        var td = $("<textarea>", {
            style: "height:100px; width: 100%",
            disabled: true,
            html: model.description,
        }).appendTo(tdd);
        tr.append(tdd);
        var td = $("<td>");
        var img = $("<td>", { class: "d-flex justify-content-center" });
        if (model.has_image) {
            $("<img>", {
                class: `event-${model.id} img-event`,
                heigth: "100px",
                width: "100px",
                src: `${
                    window.location.protocol + "//" + window.location.host
                }/storage/events/${model.id}.png`,
            }).appendTo(img);
        }
        $("<button>", {
            "data-index": i,
            class: "btn btn-outline-warning rounded-circle comment-btn px-3 py-2 me-1",
            html: `<i class="bi bi-chat-left-dots"></i>`,
        }).appendTo(td);
        $("<button>", {
            "data-index": i,
            "data-bs-target": "#main-modal",
            "data-bs-toggle": "modal",
            class: "btn btn-outline-primary rounded-circle edit-btn px-3 py-2 me-1",
            html: `<i class="bi bi-pen"></i>`,
        }).appendTo(td);
        $("<button>", {
            "data-index": i,
            class: "btn btn-outline-danger rounded-circle px-3 py-2 me-1 btn-delete",
            html: `<i class="bi bi-trash"></i>`,
        }).appendTo(td);
        tr.append(img);
        tr.append(td);
        await $("#tbody").append(tr);

        $(".img-event").on("error", function () {
            $(this).attr(
                "src",
                `${
                    window.location.protocol + "//" + window.location.host
                }/storage/events/${model.id}.jpeg`
            );
        });
    },
    onCreate: async () => {
        $("#set-Model").trigger("reset");
        $("#title").html("Create");
        state.btnEngrave.innerHTML = "Save";
        state.formSubmit.removeEventListener("submit", state.onUpdate);
        state.formSubmit.addEventListener("submit", state.onStore);
        fetch.showModal();
    },
    onShow: async (i) => {
        $("#set-Model").trigger("reset");
        $("#title").html("Edit");
        $(`.event`).attr(
            "src",
            `https://lams-1-njuv.onrender.com/storage/events/${state.models[i].id}.png`
        );
        state.activeIndex = i;
        state.btnEngrave.innerHTML = "Update";
        state.formSubmit.addEventListener("submit", state.onUpdate);
        state.formSubmit.removeEventListener("submit", state.onStore);
        state.btnEngrave.setAttribute("data-id", state.models[i].id);
        fetch.setModal(state.models[i]);
    },
    onUpdate: async (e) => {
        e.preventDefault();
        let params = $("#set-Model").serializeArray();
        if (state.base64) {
            params.push({ name: "has_image", value: true });
        } else {
            params.push({ name: "has_image", value: false });
        }
        let pk = state.btnEngrave.getAttribute("data-id");
        params.push(state.base64);
        let models = await fetch.update(state.entity, pk, params);
        if (models) {
            await state.ask();
            $("#main-modal").modal("hide");
            var img = document.querySelector(
                `.event-${state.models[state.activeIndex].id}`
            );
            img.src = URL.createObjectURL(state.file);
        }
        $(`.event`).attr("src", `https://lams-1-njuv.onrender.com/img/default.jpg`);
    },
    onStore: async (e) => {
        e.preventDefault();

        let params = $("#set-Model").serializeArray();
        params.push(state.base64);
        if (state.base64) {
            params.push({ name: "has_image", value: true });
        } else {
            params.push({ name: "has_image", value: false });
        }
        let models = await fetch.store(state.entity, params);
        state.models.push(models);
        $("#example").DataTable().destroy();
        state.writter(models, state.models.length - 1);
        $("#main-modal").modal("hide");
        $("#example").DataTable({ searching: false });
        $(`.event`).attr("src", `https://lams-1-njuv.onrender.com/img/default.jpg`);
    },
    onDestroy: async (i) => {
        let pk = state.models[i].id;
        let del = await fetch.destroy(state.entity, pk);
        if (del) {
            state.models.splice(i, 1);
            state.ask();
        }
    },
    handleFolder: () => {
        $(`#event`).click();
    },
    handleUpload: async (files) => {
        if (files && files[0]) {
            state.file = files[0];
            var img = document.querySelector(`.event`);
            var reader = new FileReader();

            reader.onloadend = async () => {
                state.base64 = {
                    name: "file_base64",
                    value: reader.result,
                };
            };
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            };
            reader.readAsDataURL(files[0]);
            img.src = URL.createObjectURL(files[0]);
        }
    },
    handleDeleteComment: async (pk) => {
        await fetch.destroy({ baseUrl: "../api", name: "comment" }, pk);
        state.handleShowComment(state.activeIndex);
    },

    handleShowComment: async (i) => {
        await $("#tbody-comment").empty();
        state.activeIndex = i;
        var id = state.models[i].id;
        var models = await fetch.ask("../api/comments", { key: id });
        await models.map(async (comment, i) => {
            let tr = $("<tr>", {
                class: `${(i + 1) % 2 == 1 ? "odd" : "even"}`,
            });
            $("<td>", { scope: "row", html: i + 1 }).appendTo(tr);
            $("<td>", {
                html: comment.commenter,
                class: "text-capitalize",
            }).appendTo(tr);
            $("<td>", {
                html: comment.description,
                class: "text-capitalize",
            }).appendTo(tr);
            var td = $("<td>");
            $("<button>", {
                "data-index": comment.id,
                class: "btn btn-outline-danger rounded-circle px-3 py-2 me-1 btn-delete-comment",
                html: `<i class="bi bi-trash"></i>`,
            }).appendTo(td);
            tr.append(td);
            await $("#tbody-comment").append(tr);
        });
        $("#comment-modal").modal("show");
    },
};
window.addEventListener("load", state.init);
