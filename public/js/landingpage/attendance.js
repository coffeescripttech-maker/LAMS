import fetch from "./../fetch.js";

$("body").on("click", "#non-ecoast", () => state.handleNon());
$("body").on("submit", "#set-Model", (e) => state.handleSubmit(e));
$("body").on("click", ".btn-out", (e) =>
    state.handleOut($(e.currentTarget).data("index"))
);
$("body").on("click", ".com", (e) =>
    state.handleSelectCom($(e.currentTarget).data("index"))
);
let sampleTest = () => {
    alert("sdf");
};
const state = {
    entity: {
        name: "attendance",
        form: [
            {
                class: "form-control",
                label: "Student Name",
                type: "string",
                id: "name",
                name: "name",
                placeholder: "Enter Student Name",
                required: true,
                input: "input",
            },
            {
                class: "form-control",
                label: "Student Section",
                type: "string",
                id: "section",
                name: "section",
                placeholder: "Enter Student Section",
                required: true,
                options: [],
                input: "select",
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
        baseUrl: "./api",
    },
    items: [],
    available_computers: [],
    availables: [],
    takens: [],
    init: () => {
        state.ask();
    },
    ask: async () => {
        $("#tbody").empty();
        $("#row-card").empty();
        $("#card").empty();
        const setting = await fetch.ask(`../api/settings`);
        state.availables = setting[0].available_slots.split(",");
        state.takens = await fetch.ask(`../api/attendances/checkAvailable`);
        state.handleAvail();
        state.available_computers = await fetch.ask(
            "../api/attendances/checkAvailable"
        );

        state.entity.form[2].options = state.available_computers.map(
            (computer) => {
                return {
                    value: computer,
                    text: computer,
                };
            }
        );

        const sections = await fetch.ask("../api/sections");
        state.entity.form[1].options = sections.map((section) => {
            return {
                value: section.name,
                text: section.name,
            };
        });
        state.entity.form[1].options.unshift({
            value: "",
            text: "Select Section",
        });
        fetch.formWritter(state.entity.form, "attendance");
        state.items = await fetch.ask("./api/attendances/today");
        state.items.forEach((attendance, i) => {
            state.handleWritter(attendance, i);
        });
    },

    handleWritter: async (item, i) => {
        if (i === 0) {
            state.handleCard(item);
            return;
        }
        let tr = $("<tr>", {
            key: `${i}-attendance`,
            class: `${(i + 1) % 2 == 1 ? "odd" : "even"} ${
                item.status === "OUT" ? "table-danger " : "table-success"
            }`,
            id: `model-${item.id}`,
        });
        $("<td>", { scope: "row", html: i }).appendTo(tr);
        $("<td>", {
            html: item.student_name,
            class: "text-capitalize ",
        }).appendTo(tr);
        $("<td>", {
            html: item.section_name,
        }).appendTo(tr);
        $("<td>", {
            html: item.com_no,
        }).appendTo(tr);
        $("<td>", {
            html: item.time,
        }).appendTo(tr);
        $("<td>", {
            html:
                item.status === "OUT"
                    ? state.items.find(({ status, user_id }) => {
                          return (
                              status === "IN" &&
                              user_id === item.user_id &&
                              item.com_no === item.com_no &&
                              item.section_name === item.section_name
                          );
                      })?.time
                    : "",
        }).appendTo(tr);
        let td = $("<td>");
        const logs = state.items.filter(
            (att) =>
                att.student_name === item.student_name &&
                att.com_no === item.com_no &&
                att.section_name === item.section_name &&
                att.status === "IN"
        );
        const isEven = logs.length % 2 === 0;
        const lastLog = state.items.filter(
            (att) =>
                att.student_name === item.student_name &&
                att.com_no === item.com_no &&
                att.section_name === item.section_name
        )[0];

        if (
            !isEven &&
            lastLog &&
            lastLog.status === "IN" &&
            item.status === "IN" &&
            !item.user_id

            // new Date() - new Date(lastLog.time) > 3 * 60 * 1000
        ) {
            let button = $("<button>", {
                class: "btn btn-danger btn-out",
                html: "OUT",
                id: `out-${item.id}`,
                "data-index": i,
            });
            button.appendTo(td);
        }
        td.appendTo(tr);
        tr.appendTo("#tbody");
    },

    handleCard: async (item) => {
        let card = $("<div>", { class: "card" });
        let cardHeader = $("<div>", {
            class: `card-header  text-white ${
                item.status === "IN" ? "bg-success" : "bg-danger"
            }`,
            html: item.status,
        });
        let cardBody = $("<div>", {
            class: "card-body d-flex justify-content-center flex-column align-items-center ",
        });
        let cardImage = $("<img>", {
            class: "card-img-top",
            onerror: `this.src='${window.location.protocol}//${window.location.host}/img/team/team-1.jpg';`,
            // src: `${window.location.protocol}//${window.location.host}/img/team/team-1.jpg`,
            src: `${window.location.protocol}//${window.location.host}/storage/credentials/${item?.user?.email}/avatar.png`,
            alt: item.student_name,
            style: "width: 400px; height: 400px;",
        });
        let body = $("<div>", {
            class: "text-start bg-light w-100 px-2 rounded  mt-2 p-3",
        });
        let cardTitle = $("<h5>", {
            class: "card-title",
            html: item.student_name,
        });
        let cardText = $("<p>", {
            class: "card-text",
            html: item.section_name,
        });
        let cardText2 = $("<p>", { class: "card-text", html: item.time });
        body.append(cardTitle, cardText, cardText2);
        cardBody.append(cardImage, body);
        card.append(cardHeader, cardBody);
        card.appendTo("#card");
    },
    handleNon: () => {
        $("#main-modal").modal("show");
    },

    sample: () => {
        alert("Sample Acquired");
    },

    handleSubmit: async (e) => {
        e.preventDefault();

        let params = $("#set-Model").serializeArray();
        params.push({ name: "status", value: "IN" });

        params.push({
            name: "date",
            value: new Date().toISOString().split("T")[0],
        });
        params.push({
            name: "time",
            value: new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
        });
        let models = await fetch.store(state.entity, params);
        $("#card").empty();
        $("#tbody").empty();
        state.items.unshift(models);
        state.items.forEach((attendance, i) => {
            state.handleWritter(attendance, i);
        });
        const val = $("#com_no").val();
        $("#com_no").empty();
        state.available_computers
            .filter((e) => e != val)
            .forEach((computer) => {
                $("<option>", {
                    value: computer,
                    text: computer,
                }).appendTo("#com_no");
            });
        $("#main-modal").modal("hide");
    },

    handleOut: async (i) => {
        await Swal.fire({
            title: "Are you going out?",
            text: "Good bye!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, check out!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const models = state.items;
                const val = $("#com_no").val();
                $("#com_no").empty();
                console.log(state.available_computers);

                let newAC = state.available_computers;
                newAC.push(val);
                console.log(newAC);
                newAC.forEach((computer) => {
                    $("<option>", {
                        value: computer,
                        text: computer,
                    }).appendTo("#com_no");
                });
                let model = { ...models[i] };
                model.status = "OUT";
                model.time = new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
                console.log(state.items);

                let _form = [];
                Object.keys(model).forEach((key) => {
                    _form.push({ name: key, value: model[key] });
                });
                let updated = await fetch.store(state.entity, _form);
                $("#card").empty();
                $("#tbody").empty();
                state.items.unshift(updated);
                state.items.forEach((attendance, i) => {
                    state.handleWritter(attendance, i);
                });
            }
        });
    },

    handleAvail: () => {
        state.availables.forEach((available) => {
            const isTaken = state.takens.find((taken) => taken == available);
            const col = $("<div>", {
                "data-index": available,
                class: ` col-lg-2 col-md-4 col-6 com`,
            });
            const card = $("<div>", {
                class: `card ${isTaken ? "bg-info" : "bg-danger"}`,
            }).appendTo(col);
            const cardBody = $("<div>", {
                class: "card-body d-flex justify-content-center align-items-center",
            }).appendTo(card);
            $("<p>", {
                class: "card-text text-center text-white font-weight-bold fs-1",
                html: available,
            }).appendTo(cardBody);
            $("#row-card").append(col);
        });
    },

    handleSelectCom: async (no) => {
        await handleComNo(no);
        state.ask();
    },
};
window.addEventListener("load", state.init);
