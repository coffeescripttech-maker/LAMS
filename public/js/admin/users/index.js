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
$("body").on("click", ".fingerprint-btn", async (e) =>
    state.handleActive($(e.currentTarget).data("index"))
);

$("body").on("click", "#fingerprint", async (e) => {
    state.handleFinger();
});

const state = {
    entity: {
        name: "user",
        attributes: ["name", "section"],
        actions: {
            find: ["fa fa-edit", "Edit", "info"],
            delete: ["fa fa-trash", "Delete", "danger"],
        },
        baseUrl: "api",
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
    fingerprints: [],
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
        state.models = await fetch.ask(`/api/users`, {
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
            "data-bs-target": "#fingerprint-modal",
            "data-bs-toggle": "modal",
            class: "btn btn-outline-info rounded-circle fingerprint-btn px-3 py-2 me-1",
            html: `<i class="ri ri-fingerprint-fill"></i>`,
        }).appendTo(div);
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
        
        try {
            let models = await fetch.store(state.entity, params);
            if (models && models.id) {
                state.models.push(models);
                $("#example").DataTable().destroy();
                state.writter(models, state.models.length - 1);
                $("#example").DataTable({ searching: false });
                $("#main-modal").modal("hide");
                $("#example").DataTable();
                $("#set-Model").trigger("reset");
            } else {
                console.error("Failed to create user: Invalid response", models);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            // The error is already handled by fetch.js, so we don't need to do anything else here
        }
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

    handleActive: async (i) => {
        state.activeIndex = i;
        state.fingerprints = []; // Reset fingerprints array
        
        // Log system info
        if (window.fpLog) {
            window.fpLog.clearLog();
            window.fpLog.info('=== Fingerprint Enrollment Started ===');
            window.fpLog.info('User: ' + state.models[i].fname + ' ' + state.models[i].lname);
            window.fpLog.info('Email: ' + state.models[i].email);
            window.fpLog.checkSystem();
        }
        
        // Check if we need to enable reader
        const urlParams = new URLSearchParams(window.location.search);
        const enableReader = urlParams.get('enable_reader');
        
        if (!enableReader && window.FingerprintConfig && !window.FingerprintConfig.enableWebSDK) {
            // Need to enable reader - show prompt
            if (window.fpLog) {
                window.fpLog.warning('Physical reader not enabled');
                window.fpLog.updateStatus(
                    'warning',
                    'Reader Not Enabled',
                    'Enabling fingerprint reader support...',
                    true
                );
            }
            
            // Auto-enable by adding parameter and reloading
            setTimeout(() => {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('enable_reader', 'true');
                if (window.fpLog) {
                    window.fpLog.info('Redirecting to enable reader: ' + newUrl.toString());
                }
                window.location.href = newUrl.toString();
            }, 1500);
            
            return;
        }
        
        // Get test object (from window or global scope)
        const test = window.test || (typeof test !== 'undefined' ? test : null);
        
        // Reader should be enabled, check if SDK is available
        if (!test || !test.sdk) {
            if (window.fpLog) {
                window.fpLog.error('Fingerprint SDK not initialized');
                window.fpLog.error('test object: ' + (test ? 'exists but no SDK' : 'not found'));
                window.fpLog.updateStatus(
                    'danger',
                    'Reader Not Available',
                    'Physical fingerprint reader not detected. Please ensure DigitalPersona SDK is installed and the reader is connected.',
                    false
                );
                window.fpLog.updateButton('Reader Not Available', false, 'danger');
            }
            return;
        }
        
        // Check for available readers
        if (window.fpLog) {
            window.fpLog.info('Checking for available readers...');
            window.fpLog.updateStatus('info', 'Checking Reader', 'Detecting fingerprint reader...', true);
        }
        
        test.getInfo().then(
            function(readers) {
                if (window.fpLog) {
                    window.fpLog.success('Found ' + readers.length + ' reader(s)');
                    readers.forEach((reader, idx) => {
                        window.fpLog.debug('Reader ' + (idx + 1) + ': ' + reader);
                    });
                }
                
                if (readers.length > 0) {
                    if (window.fpLog) {
                        window.fpLog.success('Reader ready for enrollment');
                        window.fpLog.updateStatus(
                            'success',
                            'Reader Connected',
                            'Place finger on reader to begin enrollment',
                            false
                        );
                        window.fpLog.updateButton('Next 1', true, 'info');
                    }
                } else {
                    if (window.fpLog) {
                        window.fpLog.error('No readers detected');
                        window.fpLog.updateStatus(
                            'danger',
                            'No Reader Found',
                            'Please connect a DigitalPersona fingerprint reader and try again.',
                            false
                        );
                        window.fpLog.updateButton('No Reader', false, 'danger');
                    }
                }
            },
            function(error) {
                if (window.fpLog) {
                    window.fpLog.error('Failed to enumerate readers: ' + error.message, error);
                    window.fpLog.updateStatus(
                        'danger',
                        'Reader Error',
                        'Failed to detect reader: ' + error.message,
                        false
                    );
                    window.fpLog.updateButton('Reader Error', false, 'danger');
                }
            }
        );
    },

    handleFinger: async () => {
        if (window.fpLog) {
            window.fpLog.info('Fingerprint capture button clicked');
            window.fpLog.debug('Current fingerprints count: ' + state.fingerprints.length);
        }
        
        if (state.fingerprints.length > 4) {
            // All 5 fingerprints captured, save to server
            if (window.fpLog) {
                window.fpLog.info('All 5 fingerprints captured, saving to server...');
                window.fpLog.updateStatus('info', 'Saving', 'Uploading fingerprints to server...', true);
                window.fpLog.updateButton('Saving...', false, 'info');
            }
            
            let model = state.models[state.activeIndex];
            model.fingeprints = state.fingerprints;
            model.finger_print = "1.png, 2.png, 3.png, 4.png, 5.png";
            let _model = [];
            
            // Reset progress bar
            $("#progress").css("width", "0%");
            $("#progress").attr("aria-valuenow", "0%");
            $("#progress").html("0%");
            
            Object.keys(model).forEach((key) => {
                if (key !== "id") {
                    _model.push({ name: key, value: model[key] });
                }
            });
            
            try {
                await fetch.update(state.entity, model.id, _model);
                
                if (window.fpLog) {
                    window.fpLog.success('Fingerprints saved successfully!');
                    window.fpLog.updateStatus('success', 'Success', 'Fingerprints enrolled successfully!', false);
                }
                
                // Close modal after short delay
                setTimeout(() => {
                    $("#fingerprint-modal").modal("hide");
                    state.fingerprints = []; // Reset for next enrollment
                }, 1500);
                
            } catch (error) {
                if (window.fpLog) {
                    window.fpLog.error('Failed to save fingerprints: ' + error.message, error);
                    window.fpLog.updateStatus('danger', 'Save Failed', 'Failed to save fingerprints. Please try again.', false);
                    window.fpLog.updateButton('Retry', true, 'warning');
                }
            }
        } else {
            // Add current fingerprint to array
            const currentFingerPrint = window.currentFingerPrint || '';
            
            if (!currentFingerPrint) {
                if (window.fpLog) {
                    window.fpLog.warning('No fingerprint captured yet');
                    window.fpLog.showMessage('Please scan your finger first', 'warning');
                }
                return;
            }
            
            state.fingerprints.push(currentFingerPrint);
            const count = state.fingerprints.length;
            const percentage = count * 20;
            
            if (window.fpLog) {
                window.fpLog.success('Fingerprint ' + count + ' captured');
                window.fpLog.debug('Progress: ' + percentage + '%');
            }
            
            // Update progress bar
            $("#progress").css("width", percentage + "%");
            $("#progress").attr("aria-valuenow", percentage);
            $("#progress").html(percentage + "%");
            
            // Update button text
            if (count === 4) {
                if (window.fpLog) {
                    window.fpLog.info('One more scan needed');
                    window.fpLog.updateButton("Next 5 (Last)", true, 'warning');
                }
            } else if (count === 5) {
                if (window.fpLog) {
                    window.fpLog.success('All scans complete! Ready to save');
                    window.fpLog.updateButton("Save", true, 'success');
                    window.fpLog.updateStatus('success', 'Complete', 'All 5 fingerprints captured. Click Save to finish.', false);
                }
            } else {
                if (window.fpLog) {
                    window.fpLog.updateButton("Next " + (count + 1), true, 'info');
                }
            }
            
            // Clear the image for next scan
            $("#imagediv").empty();
            if (window.fpLog) {
                window.fpLog.showMessage('Scan your finger again', 'info');
            }
        }
    },
};
window.addEventListener("load", state.init);
