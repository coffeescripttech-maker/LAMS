import fetch from "./../fetch.js";
$("body").on("click", ".edit-btn", async (e) => {
    schedule.onShow($(e.currentTarget).data("index"));
});
$("body").on("click", ".btn-delete", async (e) =>
    schedule.onDestroy($(e.currentTarget).data("index"))
);
$("body").on("click", ".question-btn", async (e) =>
    schedule.handleRedirect($(e.currentTarget).data("index"))
);
$("body").on("change", "#date", async (e) => {
    schedule.handleFilter($(e.currentTarget).val(), $("#time").val());
});
$("body").on("change", "#time", async (e) => {
    schedule.handleFilter($("#date").val(), $(e.currentTarget).val());
});
$("body").on("change", "#destination_id", async (e) => {
    schedule.handleFilter(
        $("#date").val(),
        $("#time").val(),
        $(e.currentTarget).val()
    );
});
$("body").on("click", "input[type='checkbox']", async (e) => {
    schedule.handleSeats(
        $(e.currentTarget).attr("id"),
        $(e.currentTarget).is(":checked")
    );
});
$("body").on("keydown", "#has_discount", async (e) => {
    schedule.handleTotal(schedule.models[schedule.activeIndex]);
});
$("body").on("click", ".book", async (e) => {
    schedule.handleOccupied($(e.currentTarget).data("id"));
});

const schedule = {
    entity: {
        name: "schedule",
        attributes: ["name", "section"],
        actions: {
            find: ["fa fa-edit", "Edit", "info"],
            delete: ["fa fa-trash", "Delete", "danger"],
        },
        baseUrl: "../api",
    },

    models: [],
    destinations: [],
    buses: [],
    seats: [],
    activeIndex: 0,
    btnUpdate: null,
    btnEngrave: document.getElementById("engrave"),
    btnUpdate: null,
    btnDelete: null,
    formSubmit: document.getElementById("set-Model"),
    init: async () => {
        // schedule.formSubmit.addEventListener("submit", schedule.onStore);
        // schedule.formSubmit.disable = false;
        await schedule.ask();
        // schedule.from.addEventListener("change", (e) =>
        //     schedule.handleChageRoute(e.target.value, "from")
        // );
        // schedule.to.addEventListener("change", (e) =>
        //     schedule.handleChageRoute(e.target.value, "to")
        // );
    },

    ask: async () => {
        $("#loading").css("visibility", "show");
        $("#example").DataTable().destroy();

        $("#tbody").empty();
        // $("#destination_id").empty();
        schedule.destinations = await fetch.ask(
            "../../api/landing/destinations"
        );
        schedule.buses = await fetch.ask("../../api/landing/buses");
        schedule.models = await fetch.ask("../../api/landing/schedules/list");
        // schedule.models = await fetch.translate(schedule.entity);
        if (schedule.models) {
            await schedule.models.forEach(
                async (model, i) => await schedule.writter(model, i)
            );
            schedule.destinations.forEach(async (destination) => {
                var opt = $("<option>", {
                    value: destination.id,
                    html: `${destination.fromName}-${destination.toName}`,
                    class: "text-capitalize",
                });
                $("#destination_id").append(opt);
            });
            schedule.buses.forEach(async (bus) => {
                var opt = $("<option>", {
                    value: bus.id,
                    html: `${bus.name}-${bus.plateNumber}`,
                    class: "text-capitalize",
                });
                $("#busesOpt").append(opt);
            });
        }
        $("#example").DataTable({ searching: false });
        $("#loading").css("visibility", "hidden");
    },

    handleFilter: async (val, time, destination) => {
        $("#loading").css("visibility", "visible");
        $("#example").DataTable().destroy();
        schedule.filtered = schedule.models.filter(
            (model) => model.date === val
        );
        time &&
            (schedule.filtered = schedule.filtered.filter(
                (model) => time >= model.time
            ));
        destination &&
            (schedule.filtered = schedule.filtered.filter(
                (model) => destination == model.destination_id
            ));
        $("#tbody").empty();
        if (schedule.filtered) {
            await schedule.filtered.forEach(
                async (model, i) => await schedule.writter(model, i)
            );
        }
        $("#loading").css("visibility", "hidden");
    },

    handleChageRoute: async (route, name) => {
        let id = name === "from" ? "to" : "from";
        let models = await schedule.routes.filter(
            (e) => e.id !== Number(route)
        );
        let routes = "";
        models.forEach(
            async (route) =>
                (routes += `<option class="text-capitalize" value=${route.id}>${route.name}
                    </option>`)
        );
        $(`#${id}`).html(routes);
    },
    writter: async (model, i) => {
        const timeString = model.time;

        const [hours, minutes] = timeString.split(":");

        const timeDate = new Date();
        timeDate.setHours(hours);
        timeDate.setMinutes(minutes);
        let tr = $("<tr>", {
            class: `${(i + 1) % 2 == 1 ? "odd" : "even"}`,
            id: `model-${model.id}`,
        });
        $("<td>", {
            scope: "row",
            html: i + 1,
        }).appendTo(tr);
        $("<td>", {
            html: model.date,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: timeDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }),
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: model.bus_name,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: model.full_destination,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: `₱${model?.fare?.price}`,
            class: "text-capitalize",
        }).appendTo(tr);
        $("<td>", {
            html: `₱${model?.fare?.dcprice}`,
            class: "text-capitalize",
        }).appendTo(tr);
        await $("#tbody").append(tr);
    },
    onCreate: async () => {
        $("#title").html("Create");
        schedule.btnEngrave.innerHTML = "Save";
        schedule.formSubmit.removeEventListener("submit", schedule.onUpdate);
        schedule.formSubmit.addEventListener("submit", schedule.onStore);
        fetch.showModal();
    },
    onShow: async (i) => {
        $("#title").html("Book");
        schedule.activeIndex = i;
        schedule.btnEngrave.innerHTML = "Update";
        schedule.formSubmit.addEventListener("submit", schedule.onStore);
        // schedule.formSubmit.removeEventListener("submit", schedule.onStore);
        schedule.btnEngrave.setAttribute("data-id", schedule.models[i].id);
        fetch.setModal(schedule.models[i]);
        // console.log(schedule.models[i].destination_id);
        // $("#destination_id").val(schedule.models[i].destination_id);
    },
    onUpdate: async (e) => {
        e.preventDefault();
        const result = schedule.handleValidate();
        if (!result) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                showConfirmButton: false,
                timer: 3000,
                text: "Select more seats",
            });
            return;
        }
        let params = $("#set-Model").serializeArray();
        const schedule = schedule.models[schedule.activeIndex];
        var total =
            schedule.fare.price * schedule.seats.length -
            $("#has_discount").val() +
            schedule.fare.dcprice * $("#has_discount").val();
        params.push({ name: "seats", value: JSON.stringify(schedule.seats) });
        params.push({ name: "fare_id", value: schedule.fare.id });
        params.push({
            name: "fare_price",
            value: `${schedule.fare.price}=>${schedule.fare.dcprice}`,
        });
        params.push({ name: "total_price", value: total });
        params.push({ name: "schedule_id", value: schedule.id });
        params.forEach((param) => {
            var p = $("<input>", { name: param.name, value: param.value });
            $("#set-Model").append(p);
        });
        await $("#tbody").append(tr);
        let pk = schedule.btnEngrave.getAttribute("data-id");
        let models = await fetch.update(
            { baseUrl: "../api", name: "booking" },
            pk,
            params
        );
        if (models) {
            schedule.ask();
            $("#main-modal").modal("hide");
        }
        $("#seats").css("visibility", "hidden");
    },
    handleValidate: () => {
        const result =
            schedule.seats.length >= $("#has_discount").val() &&
            schedule.seats.length > 0
                ? true
                : false;
        return result;
    },
    onStore: async (e) => {
        e.preventDefault();
        const result = await schedule.handleValidate();
        if (!result) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                showConfirmButton: false,
                timer: 3000,
                text: "Select more seats",
            });
            return;
        }
        // $("#main-modal").modal("hide");
        e.stopPropagation();
        let params = $("#set-Model").serializeArray();
        const schedule = schedule.models[schedule.activeIndex];
        var total =
            schedule.fare.price * schedule.seats.length -
            $("#has_discount").val() +
            schedule.fare.dcprice * $("#has_discount").val();
        params.push({ name: "seats", value: JSON.stringify(schedule.seats) });
        params.push({ name: "fare_id", value: schedule.fare.id });
        params.push({
            name: "fare_price",
            value: `${schedule.fare.price}=>${schedule.fare.dcprice}`,
        });
        params.push({ name: "total_price", value: total });
        params.push({ name: "schedule_id", value: schedule.id });
        params.forEach((param) => {
            var p = $("<input>", { name: param.name, value: param.value });
            $("#set-Model").append(p);
        });
        document.getElementById("set-Model").submit();
        // let models = await fetch.store(
        //     { baseUrl: "../api", name: "stripe" },
        //     params
        // );
        // schedule.models.push(models);
        // $("#example").DataTable().destroy();
        // schedule.writter(models, schedule.models.length - 1);
        // $("#example").DataTable({ searching: false });
        // $("#main-modal").modal("hide");
        // $("#example").DataTable();
        // $("#seats").css("visibility", "hidden");
        // schedule.ask();
    },
    onDestroy: async (i) => {
        let pk = schedule.models[i].id;
        let del = await fetch.destroy(schedule.entity, pk);
        if (del) {
            schedule.models.slice(i, 1);
        }
    },

    handleOccupied: (id) => {
        $("#seats").css("visibility", "visible");
        const i = schedule.models.findIndex((model) => model.id == id);
        schedule.seats = [];
        schedule.activeIndex = i;
        const schedule = schedule.models[i];
        const seats = schedule.bus.type.seats;
        $("#has_discount").attr("maxlength", seats);
        for (let index = 1; index <= seats; index++) {
            $(`#${index}`).prop("checked", false);
            var num = schedule.occupied.indexOf(index);
            num >= 0
                ? $(`#${index}`).attr("disabled", true)
                : $(`#${index}`).attr("disabled", false);
        }
        schedule.occupied.forEach((num) => {
            $(`#${num}`).attr("disabled", true);
        });
    },
    handleSeats: (id, val) => {
        const schedule = schedule.models[schedule.activeIndex];
        if (val) {
            schedule.seats.push(id);
            $("#title").addClass("text-success");
        } else {
            const index = schedule.seats.indexOf(id);
            schedule.seats.splice(index, 1);
        }
        schedule.handleTotal(schedule);
    },
    handleTotal: (schedule) => {
        alert;
        $("#title").html(
            `₱${
                schedule.fare.price *
                    (schedule.seats.length - $("#has_discount").val()) +
                schedule.fare.dcprice * $("#has_discount").val()
            }`
        );
    },
};
window.addEventListener("load", schedule.init);
