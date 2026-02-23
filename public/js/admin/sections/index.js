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
$("body").on("click", ".delete-btn", async (e) =>
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
        name: "section",
        attributes: ["yr_lvl", "name"],
        form: [
            {
                class: "form-control",
                label: "Year Level",
                type: "text",
                id: "yr_lvl",
                name: "yr_lvl",
                placeholder: "From",
                required: true,
                input: "select",
                options: [
                    { value: "1st Year", text: "1st Year" },
                    { value: "2nd Year", text: "2nd Year" },
                    { value: "3rd Year", text: "3rd Year" },
                    { value: "4th Year", text: "4th Year" },
                ],
            },
            {
                class: "form-control",
                label: "Section Name",
                type: "text",
                id: "name",
                name: "name",
                placeholder: "Enter Section Name",
                required: true,
                input: "input",
            },
        ],
        actions: {
            edit: ["bi bi-pen", "Edit", "info"],
            delete: ["bi bi-trash", "Delete", "danger"],
        },
        baseUrl: "../api",
    },

    models: [],
    organizers: [],
    criteria: [],
    faculties: [],
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
        state.entity.attributes.forEach((attribute) => {
            // check if attribute is object
            if (typeof attribute === "object") {
                if (attribute.type === "image") {
                    $("<td>", {
                        html: `<img src="${
                            window.location.protocol +
                            "//" +
                            window.location.host
                        }/storage/${state.entity}/${
                            model.id
                        }.png" class="img-fluid img-thumbnail event-${
                            model.id
                        }" alt="event" />`,
                    }).appendTo(tr);
                    return;
                } else if (attribute.type === "textarea") {
                    let textArea = $("<td>", {
                        class: "text-capitalize",
                    });
                    $("<textarea>", {
                        html: model[attribute.value],
                        class: "form-control",
                        disabled: true,
                    }).appendTo(textArea);
                    textArea.appendTo(tr);
                }
            } else {
                $("<td>", {
                    html: model[attribute],
                    class: "text-capitalize",
                }).appendTo(tr);
            }
        });
        $("<td>", {
            class: "text-center",
            html: `${
                model.is_ecoast
                    ? "<span class='badge bg-success'>Ecoast</span>"
                    : "<span class='badge bg-warning'>Non-Ecoast</span>"
            }`,
        }).appendTo(tr);
        var td = $("<td>", { class: "text-center" });
        Object.keys(state.entity.actions).forEach((action) => {
            $("<button>", {
                class: `btn btn-outline-${state.entity.actions[action][2]} rounded-circle px-3 py-2 me-1 ${action}-btn`,
                "data-index": i,
                html: `<i class="${state.entity.actions[action][0]}"></i>`,
            }).appendTo(td);
        });
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
        state.activeIndex = i;
        $("#ecoast").prop("checked", state.models[i].is_ecoast);
        state.btnEngrave.innerHTML = "Update";
        state.formSubmit.addEventListener("submit", state.onUpdate);
        state.formSubmit.removeEventListener("submit", state.onStore);
        state.btnEngrave.setAttribute("data-id", state.models[i].id);
        fetch.setModal(state.models[i]);
        $("#main-modal").modal("show");
    },
    onUpdate: async (e) => {
        e.preventDefault();
        let params = $("#set-Model").serializeArray();
        params.push({
            name: "is_ecoast",
            value: $("#is_ecoast:checked").val() ? true : false,
        });
        if (state.base64) {
            params.push({ name: "has_image", value: true });
        } else {
            params.push({ name: "has_image", value: false });
        }
        let pk = state.btnEngrave.getAttribute("data-id");
        $("#main-modal").modal("hide");

        params.push(state.base64);
        let models = await fetch.update(state.entity, pk, params);
        if (models) {
            await state.ask();
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
        params.push({
            name: "is_ecoast",
            value: $("#ecoast:checked").val() ? true : false,
        });
        if (state.base64) {
            params.push({ name: "has_image", value: true });
        } else {
            params.push({ name: "has_image", value: false });
        }
        let models = await fetch.store(state.entity, params);
        $("#main-modal").modal("hide");
        $("#example").DataTable().destroy();
        state.ask();
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
