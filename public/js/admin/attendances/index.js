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
$("body").on("change", "#user_id", async (e) => {
    state.handleHideShow(e.target.value);
});
$("body").on("change", ".salain", async (e) => {
    const key = $(e.currentTarget).data("key");
    if (key) {
        state.handleFilter(key, e.target.value);
    } else {
        console.error("data-key attribute is missing or undefined.");
    }
});
$("body").on("click", "#export", async (e) => state.handleExport());

const state = {
    entity: {
        name: "attendance",
        attributes: ["name", "section"],
        form: [
            {
                class: "form-control",
                label: "Student",
                type: "text",
                id: "user_id",
                name: "user_id",
                placeholder: "Select student",
                options: [],
                input: "select",
            },
            {
                class: "form-control",
                label: "Student Name",
                type: "string",
                id: "name",
                name: "name",
                placeholder: "Enter Student Name",
                required: false,
                input: "input",
            },
            {
                class: "form-control",
                label: "Student Section",
                type: "string",
                id: "section",
                name: "section",
                placeholder: "Enter Student Section",
                required: false,
                options: [],
                input: "select",
            },
            {
                class: "form-control",
                label: "Date",
                type: "date",
                max: new Date().toISOString().split("T")[0],
                id: "date",
                name: "date",
                placeholder: "Enter Date",
                required: true,
                input: "input",
            },
            {
                class: "form-control",
                label: "Time",
                type: "time",
                id: "time",
                name: "time",
                placeholder: "Enter Time ",
                required: true,
                input: "input",
            },
            {
                class: "form-control",
                label: "Status",
                type: "text",
                id: "status",
                name: "status",
                placeholder: "Enter Status",
                required: false,
                input: "select",
                options: [
                    { value: "IN", text: "IN" },
                    { value: "OUT", text: "OUT" },
                ],
            },
            {
                class: "form-control",
                label: "Remarks",
                type: "text",
                id: "remarks",
                name: "remarks",
                placeholder: "Enter Remarks",
                required: false,
                input: "input",
            },
            {
                class: "form-control",
                label: "Computer No.",
                type: "text",
                id: "com_no",
                name: "com_no",
                placeholder: "Enter Computer No.",
                required: true,
                input: "select",
                options: [],
            },
        ],
        actions: {
            find: ["fa fa-edit", "Edit", "info"],
            delete: ["fa fa-trash", "Delete", "danger"],
        },
        baseUrl: "../api",
    },

    models: [],
    filtered: [],
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
    handleHideShow: async (val) => {
        if (val) {
            $("#name").attr("disabled", true);
            $("#section").attr("disabled", true);
        } else {
            $("#name").attr("disabled", false);
            $("#section").attr("disabled", false);
        }
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
    handleFilter: async (key, value) => {
        $("#loading").css("visibility", "show");
        $("#example").DataTable().destroy();
        $("#tbody").empty();
        state.filtered =
            state.filtered.length == 0 ? [...state.models] : state.filtered;
        if (key && value) {
            if (key === "start" || key === "end") {
                state.filtered = state.filtered.filter((model) => {
                    let modelTime = model.time.split(":").slice(0, 2).join(":"); // Extract hours and minutes
                    let startTime = $("#startTime").val();
                    let endTime = $("#endTime").val();
                    return modelTime >= startTime && modelTime <= endTime;
                });
            } else {
                state.filtered = state.filtered.filter(
                    (model) => String(model[key]) === String(value)
                );
            }
            if (state.filtered) {
                await state.filtered.forEach(
                    async (model, i) => await state.writter(model, i)
                );
            }
        }
        $("#example").DataTable({ searching: false });
        $("#loading").css("visibility", "hidden");
    },
    ask: async () => {
        $("#loading").css("visibility", "show");
        $(`#modal-body-${state.entity.name}`).empty();
        const students = await fetch.ask("../api/users/list", {
            key: "student",
        });
        const available_computers = await fetch.ask(
            "../api/attendances/checkAvailable"
        );

        state.entity.form[7].options = available_computers.map((computer) => {
            return {
                value: computer,
                text: computer,
            };
        });

        const sections = await fetch.ask("../api/sections");
        $("#sections-list").empty();
        $("#sections-list").append(`<option value="">Select Section</option>`);
        sections.forEach((section) => {
            console.log(section);

            $("#sections-list").append(
                `<option value="${section.name}">${section.name}</option>`
            );
        });
        state.entity.form[2].options = sections.map((section) => {
            return {
                value: section.id,
                text: section.name,
            };
        });
        state.entity.form[2].options.unshift({
            value: "",
            text: "Select Section",
        });
        state.entity.form[0].options = students.map((student) => {
            return {
                value: student.id,
                text: student.full_name,
            };
        });
        state.entity.form[0].options.unshift({
            value: "",
            text: "Select Student",
        });
        console.log(state.entity.form);

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
        $("<td>", {
            html: model.student_name,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: model.section_name,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", { html: model.date }).appendTo(tr);
        $("<td>", { html: model.time }).appendTo(tr);
        $("<td>", { html: model.status }).appendTo(tr);
        $("<td>", { html: model.remarks }).appendTo(tr);
        $("<td>", { html: model.com_no }).appendTo(tr);

        var td = $("<td>", { class: "text-center" });
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
    handleExport: () => {
        var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
        var tab = document.getElementById("example"); // id of table

        for (var j = 0; j < tab.rows.length; j++) {
            var row = tab.rows[j].cloneNode(true);
            // Remove the last cell (actions column) from each row
            row.removeChild(row.lastElementChild);
            // Loop through cells and set style
            Array.from(row.cells).forEach((cell, i) => {
                if (i === 3) {
                    // Assuming the 2nd column is Date/Time
                    cell.setAttribute(
                        "style",
                        "mso-number-format:'Short Date'; width:120px;"
                    );
                } else if (i === 4) {
                    cell.setAttribute(
                        "style",
                        "mso-number-format:'hh:mm'; width:100px;"
                    );
                } else {
                    cell.setAttribute("style", "width:120px;");
                }
            });
            tab_text += row.innerHTML + "</tr>";
        }

        tab_text += "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); // remove links
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove images
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // remove input elements

        var msie = window.navigator.userAgent.indexOf("MSIE ");
        // If Internet Explorer
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();

            sa = txtArea1.document.execCommand(
                "SaveAs",
                true,
                "AttendanceData.xls"
            );
        } else {
            // Other browsers
            const filename = "AttendanceData.xls";
            const blob = new Blob([tab_text], {
                type: "application/vnd.ms-excel",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        return sa;
    },
};
window.addEventListener("load", state.init);
