import fetch from "../../fetch.js";

$("body").on("click", ".dropdown-item", async (e) => {
    state.handleFilter($(e.currentTarget).data("value"));
});
$("body").on("click", ".reservations", async (e) => {
    state.handleStatusClick(e);
});
const state = {
    models: [],
    data: {},
    status: "pending",
    init: async () => {
        state.ask();
    },
    ask: async () => {
        state.data = await fetch.ask("../api/dashboard");
        state.models = await fetch.ask("../api/dashboard/transactions");
        if (state.models) {
            state.models
                .filter((e) => e.status === state.status)
                .forEach((model, i) => state.writter(model, i));
        }
        for (let key in state.data) {
            console.log(key, state.data[key]);

            $(`#${key}-data`).html(state.data[key]);
        }
        state.handleChart();
    },

    handleStatusClick: async (e) => {
        state.status = $(e.currentTarget).data("status");
        $("#tbody").empty();
        state.models
            .filter((e) => e.status === state.status)
            .forEach((model, i) => state.writter(model, i));
    },
    handleChart: async () => {
        echarts.init(document.querySelector("#trafficChart")).setOption({
            tooltip: {
                trigger: "item",
            },
            legend: {
                top: "5%",
                left: "center",
            },
            series: [
                {
                    name: "Reservations",
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: "center",
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: "18",
                            fontWeight: "bold",
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: [
                        {
                            value: state.data.reservations_pending,
                            name: "Pending",
                        },
                        {
                            value: state.data.reservations_approved,
                            name: "Approved",
                        },
                        {
                            value: state.data.reservations_rejected,
                            name: "Rejected",
                        },
                    ],
                },
            ],
        });
    },
    handleFilter: async (value) => {
        $("#tbody").empty();
        let model = [...state.models];
        console.log(value);

        model = model.filter((m) => m.status == value);
        console.log(model);
        model.forEach((m, i) => state.writter(m, i));
    },
    handleStatus: async (value) => {
        switch (value) {
            case "pending":
                return `<span class="badge bg-warning">${value}</span>`;
            case "success":
                return `<span class="badge bg-success">${value}</span>`;
            case "ongoing":
                return `<span class="badge bg-info">${value}</span>`;
            case "rejected":
                return `<span class="badge bg-danger">${value}</span>`;

            default:
                return `<span class="badge bg-primary">${value}</span>`;
        }
    },
    writter: async (model, i) => {
        let tr = $("<tr>", {
            class: `${(i + 1) % 2 == 1 ? "odd" : "even"}`,
            id: `model-${model.id}`,
        });
        $("<td>", {
            scope: "row",
            html: i + 1,
        }).appendTo(tr);
        $("<td>", {
            html: `report Id-${model.id}`,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: await state.handleStatus(model.status),
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: model.faculty_name,
        }).appendTo(tr);
        await $("#tbody").append(tr);
    },
};
window.addEventListener("load", state.init);
