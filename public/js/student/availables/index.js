import fetch from "../../fetch.js";

const state = {
    availables: [],
    takens: [],

    init: () => {
        state.ask();
    },
    ask: async () => {
        const setting = await fetch.ask(`../api/settings`);
        state.availables = setting[0].available_slots.split(",");
        state.takens = await fetch.ask(`../api/attendances/checkAvailable`);
        state.handleWriter();
    },

    handleWriter: () => {
        state.availables.forEach((available) => {
            const isTaken = state.takens.find((taken) => taken == available);
            const col = $("<div>", {
                class: ` col-lg-2 col-md-4 col-6 `,
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
};

window.addEventListener("load", state.init);
