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
        name: "setting",
        attributes: ["name", "section"],
        form: [
            {
                class: "form-control",
                label: "Lab Name",
                type: "text",
                id: "name",
                name: "lab_name",
                placeholder: "Enter lab name",
                required: true,
                input: "input",
            },
            {
                class: "form-control",
                label: "Available slots",
                type: "string",
                id: "slots",
                name: "available_slots",
                placeholder: "Enter available slots(12,23,32,123)",
                required: true,
                input: "input",
            },
            {
                class: "form-control",
                label: "Maintainance slots",
                type: "string",
                id: "slots",
                name: "maintainance_slots",
                placeholder: "Enter maintainance slots(12,23,32,123)",
                required: false,
                input: "input",
            },
            {
                class: "form-control",
                label: "Open Hour",
                type: "time",
                id: "open",
                name: "open_hour",
                placeholder: "Enter open hour",
                required: true,
                input: "input",
            },
            {
                class: "form-control",
                label: "Close Hour",
                type: "time",
                id: "close",
                name: "close_hour",
                placeholder: "Enter close hour",
                required: true,
                input: "input",
            },
        ],
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
    // btnNew: document.getElementById("btn-new"),
    formSubmit: document.getElementById("set-Model"),
    init: async () => {
        state.formSubmit.addEventListener("submit", state.onStore);
        state.formSubmit.disable = false;
        // state.btnNew.addEventListener("click", state.onCreate);
        // state.btnNew.disable = false;

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
        $(`#modal-body-${state.entity.name}`).empty();
        await fetch.formWritter(state?.entity?.form, state?.entity?.name);
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
        $("<td>", { html: model.lab_name, class: "text-capitalize" }).appendTo(
            tr
        );
        $("<td>", {
            html: model.available_slots,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: model.maintainance_slots,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", { html: model.open_hour, class: "text-capitalize" }).appendTo(
            tr
        );
        $("<td>", {
            html: model.close_hour,
            class: "text-capitalize",
        }).appendTo(tr);
        var td = $("<td>");
        $("<button>", {
            "data-index": i,
            "data-bs-target": "#main-modal",
            "data-bs-toggle": "modal",
            class: "btn btn-outline-primary rounded-circle edit-btn px-3 py-2 me-1",
            html: `<i class="bi bi-pen"></i>`,
        }).appendTo(td);
        tr.append(td);
        await $("#tbody").append(tr);
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
            `http://localhost:8000/storage/events/${state.models[i].id}.png`
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
        $(`.event`).attr("src", `http://localhost:8000/img/default.jpg`);
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
        $(`.event`).attr("src", `http://localhost:8000/img/default.jpg`);
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
