const request = async (url, params, method = "GET") => {
    const token = $("#token").val();

    // const csrfToken = getCsrfToken();
    // add some function to check if the token is expired
    // if (token == "") {
    //     Swal.fire({
    //         icon: "error",
    //         title: "Oops...",
    //         showConfirmButton: false,
    //         timer: 3000,
    //         text: "The server responded with an unexpected status!",
    //     });
    //     return;
    // }

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            enctype: "multipart/form-data",
            Authorization: `Bearer ${token || ""}`,
            // "X-CSRF-TOKEN": csrfToken,
        },
    }; //, mimeType: "multipart/form-data"
    if (params) {
        if (method === "GET") {
            url += params != "" ? `?${objectToQueryString(params)}` : "";
        } else {
            options.body = serialized(params);
            $.post($(this).attr("building"), options.body, function (data) {});
            // options.data = file;
        }
    }
    const response = await fetch(url, options);
    if (response.status === 404 || response.status === 500) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            showConfirmButton: false,
            timer: 3000,
            text: "The server responded with an unexpected status!",
        });
    } else if (response.status === 204) {
        return null;
    }

    const result = await response.json();
    return result;
};
const objectToQueryString = (obj) => {
    let condition = Object.keys(obj)
        .map((key) => `${key}=${obj[key]}`)
        .join("&");
    return condition.replace(/&\s*$/, "");
};
const getCsrfToken = () => {
    const metaTag = document.head.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : "";
};
const generateErrorResponse = (message) => {
    return { status: "error", message };
};
const serialized = (params) => {
    if (typeof params === "string" || params instanceof String) {
        return params;
    } else {
        var obj = {};
        for (var i in params) {
            var n = params[i].name,
                v = params[i].value;

            obj[n] =
                obj[n] === undefined
                    ? v
                    : $.isArray(obj[n])
                    ? obj[n].concat(v)
                    : [obj[n], v];
        }
        return JSON.stringify(obj);
    }
};
const ask = (url, params) => request(url, params);
const find = (url, id) => {
    request(`${url}/${id}/find`);
};
const store = async (_entity, params, withMsge = true) => {
    let url = `/${_entity.baseUrl}/${pluralize(_entity.name)}/save`;
    const model = await request(url, params, "POST");
    if (model) {
        if (withMsge) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
        }
        return model;
    }
};
// direct URL
const engrave = async (url, params, willEngrave = false) => {
    let method = willEngrave ? "POST" : `PUT`;
    const model = await updateOrCreate(url, params, method);
    if (model) {
        if (withMsge) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
        }
        return model;
    }
};
const update = async (_entity, pk, params, withMsge = true) => {
    let url = `/${_entity.baseUrl}/${pluralize(_entity.name)}/${pk}/update`;
    const model = await request(url, params, "PUT");
    if (model) {
        if (withMsge) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been Updated",
                showConfirmButton: false,
                timer: 1500,
            });
        }
        return model;
    }
};
/**
 *
 * @param {'string'} url
 * @param {*} params
 * @param {*} method
 */
const updateOrCreate = async (url, params, method = "POST") => {
    const res = await request(url, params, method);
    let msge =
        method == "POST"
            ? "Your work has been saved"
            : "Your work has been updated";
    if (res) {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: msge,
            showConfirmButton: false,
            timer: 1500,
        });
        return res;
    }
};
const destroy = async (_entity, pk, willRemove = true) => {
    const { value: result } = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    });
    if (result) {
        let url = `/${_entity.baseUrl}/${pluralize(
            _entity.name
        )}/${pk}/destroy`;
        const response = await request(url, "", "DELETE");
        if (response) {
            if (response.success) {
                $(`#${_entity.name}-${pk}`).remove();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            if (willRemove) {
                $(`#model-${pk}`).remove();
            }
            return true;
        }
    }
};
/*  
/ Mapping
/ ------------
/  it will authomatic map on the table
*/
var entity = null;
var attributes = null;
var actions = null;
var baseUrl = null;

const translate = async (_entity, key = "") => {
    entity = _entity.name;
    baseUrl = _entity.baseUrl;
    $("#table-main").empty();
    let params = null;
    if (typeof key === "string" || key instanceof String) {
        params = key != "" ? { key: key } : "";
    } else {
        params = key;
    }
    const _models = await ask(`./${baseUrl}/${pluralize(entity)}`, params);
    return _models;
};
const writer = (_entity, model) => {
    //log
    // console.log(model)
    attributes = _entity.attributes;
    actions = _entity.actions;
    var index = $("#table-main tr").length;
    index =
        $(`#model-${model.id}`).length == 0
            ? index
            : $(`#model-${model.id}`).data("index");
    let tr = $("<tr>", {
        id: `model-${model.id}`,
        "data-index": index,
    });
    $("<td>", { html: `${index + 1}.` }).appendTo(tr);
    const attriMap = new Map(Object.entries(model));
    /**
     * Attribute
     */
    attributes.forEach((attri) => {
        if (Array.isArray(attri)) {
            if (attri[0] == "img") {
                let tdimg = $("<td>");
                $("<img>", {
                    src: `${_entity.imgUrl}/${attriMap.get(attri[1])}`,
                    width: "90",
                    height: "70",
                }).appendTo(tdimg);
                tdimg.appendTo(tr);
            }
        } else {
            $("<td>", { html: attriMap.get(attri) }).appendTo(tr);
        }
    });
    /**
     * Check if actions is available the append action in thead
     */
    let td = $("<td>");
    let group = $("<div>", { class: "btn-group" });
    Object.keys(actions).map((key) => {
        let icons = actions[key][0];
        if (actions[key][0].length == 3) {
            icons =
                model[actions[key][0][0][0]] == actions[key][0][0][1]
                    ? actions[key][0][1]
                    : actions[key][0][2];
        }
        if (actions[key].length === 4) {
            let val = actions[key][3][1]; // value
            if (typeof val === "boolean") {
                if (model[actions[key][3][0]] == val) {
                    $("<button>", {
                        "data-index": index,
                        "data-id": model.id,
                        class: `btn btn-${actions[key][2]} btn-${key}`,
                        "data-toggle": "tooltip",
                        title: actions[key][1],
                        html: $("<span>", { class: icons }),
                    }).appendTo(group);
                }
            } else {
                if (val.indexOf("!") > -1) {
                    //Not
                    if (model[actions[key][3][0]] != val.replace("!", "")) {
                        //key
                        $("<button>", {
                            "data-index": index,
                            "data-id": model.id,
                            class: `btn btn-${actions[key][2]} btn-${key}`,
                            "data-toggle": "tooltip",
                            title: actions[key][1],
                            html: $("<span>", { class: icons }),
                        }).appendTo(group);
                    }
                } else {
                    if (model[actions[key][3][0]] == val) {
                        $("<button>", {
                            "data-index": index,
                            "data-id": model.id,
                            class: `btn btn-${actions[key][2]} btn-${key}`,
                            "data-toggle": "tooltip",
                            title: actions[key][1],
                            html: $("<span>", { class: icons }),
                        }).appendTo(group);
                    }
                }
            }
        } else {
            $("<button>", {
                "data-index": index,
                "data-id": model.id,
                class: `btn btn-${actions[key][2]} btn-${key}`,
                "data-toggle": "tooltip",
                title: actions[key][1],
                html: $("<span>", { class: icons }),
            }).appendTo(group);
        }
    });

    group.appendTo(td);
    td.appendTo(tr);
    if ($(`#model-${model.id}`).length == 0) {
        $("#table-main").append(tr);
    } else {
        $(`#model-${model.id}`).replaceWith(tr);
    }
};

const showModal = () => {
    $("#set-model").trigger("reset");
    $("#modal-title").html("Add New");
    $("#engrave").attr("data-id", 0);
    $("#modal-main").modal("show");
};
const setModal = (model, _entity = "") => {
    $("#set-model").trigger("reset");
    $("#modal-title").html(`Update`);
    // console.log(model)
    Object.keys(model).map((key) => {
        if ($(`[name='${key}']`).length !== 0) {
            if ($(`[name='${key}_file']`).attr("type") == "file") {
                document.getElementById(
                    `${key}-img`
                ).src = `${_entity.imgUrl}/${model[key]}`;
            } else if (typeof model[key] == "boolean") {
                $(`[name='${key}']`).val(model[key] ? 1 : 0);
            } else {
                $(`[name='${key}']`).val(model[key]);
            }
        }
    });
    $("#modal-main").modal("show");
};
/*
/ include all noun that doesn't add s only
*/
const plurals = {
    person: "people",
    radius: "radii",
    check: "cheques",
    batch: "batches",
    access: "accesses",
    survey: "surveys",
    surveykey: "surveykeys",
};
const pluralMap = new Map(Object.entries(plurals));
const withEs = ["s", "h", "c"];
const pluralize = (word) =>
    pluralMap.has(word)
        ? pluralMap.get(word)
        : word.substr(-1) === "y"
        ? word.replace(/.$/, "ies")
        : withEs.indexOf(word.substr(-1)) !== -1
        ? `${word}es`
        : `${word}s`;
/**
 * regular expression:
 * The / mark the beginning and end of the regular expression
 * The , matches the comma
 * The \s means whitespace characters (space, tab, etc) and the * means 0 or more
 * The $ at the end signifies the end of the string
 */
const option_list = async (
    _model,
    _attri = "name",
    searchKey = "",
    isRequired = true
) => {
    // $(`.${_model}-id`).empty();
    if (!isRequired) {
        $(`.${_model}-id`).append($("<option>", { value: null, text: null }));
    }
    let models = await ask(`/api/${pluralize(_model)}/list`, searchKey);
    models.forEach((model) => {
        let title = "";

        if (typeof _attri === "string" || _attri instanceof String) {
            title = model[_attri];
        } else {
            for (var i in _attri) {
                title += `${model[_attri[i]]} |`;
            }
        }
        $(`.${_model}-id`).append(
            $("<option>", { value: model.id, text: title })
        );
    });
    return models;
};

const inserMany = async (url, params) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            enctype: "multipart/form-data",
        },
    }; //, mimeType: "multipart/form-data"
    options.body = params;
    $.post($(this).attr("building"), options.body, function (data) {});
    const response = await fetch(url, options);
    if (response.status === 404 || response.status === 500) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            showConfirmButton: false,
            timer: 3000,
            text: "The server responded with an unexpected status!",
        });
    } else if (response.status === 204) {
        return null;
    }

    const result = await response.json();
    return result;
};
const globalSearch = (objects, key) =>
    objects.filter((obj) => {
        if (typeof obj === "object") {
            let filterObject = Object.values(obj).filter((val) => val !== null);
            let nestedResults = globalSearch(filterObject, key);
            return nestedResults.length > 0;
        } else if (
            typeof obj === "string" &&
            obj.toUpperCase().search(key.toUpperCase()) > -1
        ) {
            return true;
        }
        return false;
    });
const formWritter = async (items = [], _entity = "") => {
    const row = $("<div>", {
        class: "row g-3",
    });
    await items.forEach((item) => {
        let colClass = "";
        if (item.col) {
            Object.keys(item?.col).forEach((key) => {
                colClass += `col-${key}-${item?.col[key]}`;
            });
        } else {
            colClass = "col-12";
        }
        console.log(colClass);
        let col = $("<div>", {
            class: colClass,
        });
        $("<label>", {
            for: item?.id,
            class: "form-label",
            text: item?.label,
        }).appendTo(col);

        if (item.input == "select") {
            let select = $("<select>", {
                ...item,
            });
            item?.options.forEach((option) => {
                $("<option>", {
                    value: option.value,
                    text: option.text,
                }).appendTo(select);
            });
            select.appendTo(col);
        }
        if (item.input == "input") {
            $("<input>", {
                ...item,
            }).appendTo(col);
        }
        if (item.input == "textarea") {
            $("<textarea>", {
                ...item,
            }).appendTo(col);
        }
        row.append(col);
    });
    console.log(row);
    $(`#modal-body-${_entity}`).append(row);
};
export default {
    globalSearch,
    ask,
    find,
    update,
    store,
    engrave,
    updateOrCreate,
    destroy,
    writer,
    translate,
    showModal,
    setModal,
    option_list,
    inserMany,
    formWritter,
};
