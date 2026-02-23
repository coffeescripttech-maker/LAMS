import fetch from "../../fetch.js";

$("body").on("click", ".like-btn", async (e) =>
    state.handleLike($(e.currentTarget).data("index"))
);

$("body").on("click", ".comment-btn", async (e) =>
    state.handleComments($(e.currentTarget).data("index"))
);

const state = {
    entity: {
        name: "event",
        attributes: ["name", "section"],
        baseUrl: "../api",
    },
    user: JSON.parse($("#user_id").val()),
    models: [],
    formSubmit: document.getElementById("set-Model"),
    activeIndex: null,
    init: () => {
        state.formSubmit.addEventListener("submit", state.handleAddComment);
        state.formSubmit.disable = false;
        state.ask();
    },
    ask: async () => {
        state.models = await fetch.ask("../../api/events");
        if (state.models) {
            state.models.forEach((model, index) =>
                state.handleWriter(model, index)
            );
        }
    },
    handleAddComment: async (e) => {
        e.preventDefault();
        var event = state.models[state.activeIndex].id;
        let params = $("#set-Model").serializeArray();
        params.push(
            { name: "event_id", value: event },
            { name: "user_id", value: state.user.id }
        );
        var model = await fetch.store(
            { name: "comment", baseUrl: "../api" },
            params,
            false
        );
        $("#description").val("");
        state.handleCommentsWritter(model);
    },
    handleCommentsWritter: async (comment) => {
        var row = $("<div>", { class: "d-flex flex-row p-3" });

        var div = $("<div>", { class: "w-100" });
        var div2 = $("<div>", {
            class: "d-flex justify-content-between align-items-center",
        });
        var div3 = $("<div>", {
            class: "d-flex flex-row align-items-center",
        });
        $("<span>", {
            class: "mr-2",
            html: comment.commenter,
        }).appendTo(div3);
        div2.append(div3);
        div.append(div2);
        $("<p>", {
            class: "text-justify comment-text mb-0",
            html: comment.description,
        }).appendTo(div);
        row.append(div);
        $("#comments").append(row);
    },

    handleComments: (i) => {
        state.activeIndex = i;
        $("#comments").empty();
        var comments = state.models[i].list;
        if (comments) {
            comments.map((comment) => {
                state.handleCommentsWritter(comment);
            });
        }

        $("#comment-modal").modal("show");
    },
    handleLike: async (i) => {
        var model = state.models[i];
        $(`#like-${i}`).removeClass();
        var likes = parseInt($(`#p-${i}`).html());

        if (model.likes) {
            var meron = model.likes.filter((like) => like === state.user.email);
            if (meron.length > 0) {
                $(`#like-${i}`).attr("class", "bi bi-hand-thumbs-up");
                model.likes = model.likes.filter(
                    (like) => like !== state.user.email
                );
                $(`#p-${i}`).html(likes - 1);
            } else {
                $(`#like-${i}`).attr("class", "bi bi-hand-thumbs-up-fill");
                model.likes.push(state.user.email);
                $(`#p-${i}`).html(likes + 1);
            }
        } else {
            $(`#like-${i}`).attr("class", "bi bi-hand-thumbs-up-fill");
            $(`#p-${i}`).html(likes + 1);
            model.likes = [state.user.email];
        }
        await fetch.update(
            state.entity,
            model.id,
            [
                {
                    name: "likes",
                    value: model.likes,
                },
            ],
            false
        );
    },
    handleWriter: (model, i) => {
        var meron = model.likes
            ? model.likes.filter((like) => like === state.user.email)
            : [];

        var card = $("<div>", {
            class: "card mx-auto",
            style: "max-width: 50rem;",
        });
        if (model.has_image) {
            $("<img>", {
                class: "card-img-top img-event",
                id: `img-${i}`,
                src: `${
                    window.location.protocol + "//" + window.location.host
                }/storage/events/${model.id}.png`,
            }).appendTo(card);
        }
        $("<div>", {
            class: "card-title ms-2",
            html: `${model.title} date: ${
                new Date(model.created_at).toISOString().split("T")[0]
            }`,
        }).appendTo(card);
        var cardB = $("<div>", { class: "card-body" }).appendTo(card);

        $("<p>", { html: model.description }).appendTo(cardB);
        var footer = $("<div>", {
            class: "card-footer ms-2 d-flex justify-content-end",
        });
        $("<button>", {
            "data-index": i,
            class: "btn btn-outline-warning me-2 comment-btn",
            html: `<i class="bi bi-chat-left-dots-fill"></i>`,
        }).appendTo(footer);
        $("<button>", {
            "data-index": i,
            class: "btn btn-outline-info like-btn",
            html: `<span id="p-${i}">${
                model.likes.length
            }</span> <i id="like-${i}" class="bi bi-hand-thumbs-up${
                meron.length > 0 ? "-fill" : ""
            }"></i>`,
        }).appendTo(footer);
        card.append(footer);
        $("#container").append(card);
        $(".img-event").on("error", function () {
            $(this).attr(
                "src",
                `${
                    window.location.protocol + "//" + window.location.host
                }/storage/events/${model.id}.jpeg`
            );
        });
    },
};
window.addEventListener("load", state.init);
