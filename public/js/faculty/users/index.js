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
$("body").on("click", ".receipts-btn", async (e) =>
    state.handleRedirect($(e.currentTarget).data("id"))
);
$("body").on("change", "#is_male", async (e) =>
    state.handleis_male($("#is_male:checked").val())
);

const state = {
    entity: {
        name: "user",
        attributes: ["name", "section"],
        actions: {
            find: ["fa fa-edit", "Edit", "info"],
            delete: ["fa fa-trash", "Delete", "danger"],
        },
        baseUrl: "../../api",
    },

    models: [],
    organizers: [],
    criteria: [],
    activeIndex: 0,
    btnUpdate: null,
    btnEngrave: document.getElementById("engrave"),
    btnUpdate: null,
    btnDelete: null,
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
        state.models = await fetch.ask(`${state.entity.baseUrl}/users`, {
            role: $("#role").val(),
        });
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
        $("<td>", {
            html: `<p class="fw-bold"> ${model.fname} ${
                model.mname ? model.mname[0] + "." : " "
            } ${model.lname}</p>
            <span><i class="${
                model.is_male
                    ? "ri-men-line text-primary"
                    : "ri-women-line text-danger"
            }"></i>${model.role}</span>
        `,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: `<p>${model.email}</p><p>${model.mobile}</p>`,
        }).appendTo(tr);

        var td = $("<td>");
        var div = $("<div>", {
            class: "d-flex justify-content-center align-items-center h-100",
        });
        // if ($("#role").val() === "student") {
        //     $("<button>", {
        //         "data-id": model.id,
        //         class: "btn btn-outline-warning rounded-circle receipts-btn px-3 py-2 me-1",
        //         html: `<i class="bi bi-receipt"></i>`,
        //     }).appendTo(div);
        // }
        $("<button>", {
            "data-index": i,
            "data-bs-target": "#main-modal",
            "data-bs-toggle": "modal",
            class: "btn btn-outline-primary rounded-circle edit-btn px-3 py-2 me-1",
            html: `<i class="bi bi-pen"></i>`,
        }).appendTo(div);
        $("<button>", {
            "data-index": i,
            class: "btn btn-outline-danger rounded-circle px-3 py-2 me-1 btn-delete",
            html: `<i class="bi bi-trash"></i>`,
        }).appendTo(div);
        td.append(div);
        tr.append(td);
        await $("#tbody").append(tr);
    },
    onCreate: async () => {
        $("#title").html("Create");
        state.btnEngrave.innerHTML = "Save";
        state.formSubmit.removeEventListener("submit", state.onUpdate);
        state.formSubmit.addEventListener("submit", state.onStore);
        fetch.showModal();
    },
    onShow: async (i) => {
        $("#title").html("Edit");
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
        // var gender = $("#is_male:checked").val() ? true : false;
        // params.push({
        //     name: "is_male",
        //     value: gender,
        // });
        let pk = state.btnEngrave.getAttribute("data-id");
        let models = await fetch.update(state.entity, pk, params);
        if (models) {
            state.ask();
            $("#main-modal").modal("hide");
        }
        $("#set-Model").trigger("reset");
    },
    onStore: async (e) => {
        e.preventDefault();
        let params = $("#set-Model").serializeArray();
        params.push({ name: "password", value: "password" });
        let models = await fetch.store(state.entity, params);
        state.models.push(models);
        $("#example").DataTable().destroy();
        state.writter(models, state.models.length - 1);
        $("#example").DataTable({ searching: false });
        $("#main-modal").modal("hide");
        $("#example").DataTable();
        $("#set-Model").trigger("reset");
    },
    onDestroy: async (i) => {
        let pk = state.models[i].id;
        let del = await fetch.destroy(state.entity, pk);
        if (del) {
            state.models.splice(i, 1);
            state.ask();
        }
    },

    handleis_male: (val) => {
        val
            ? $("#is_maleLabel").html("Male")
            : $("#is_maleLabel").html("Female");
    },

    handleRedirect: (id) => {
        window.location.replace(`../receipts/${id}`);
    },
};
window.addEventListener("load", state.init);
