var test = null;

var state = document.getElementById("content-capture");

var myVal = ""; // Drop down selected value of reader
var disabled = true;
var startEnroll = false;

let currentFingerPrint = "";
var fingerResult = null;
let isIn = null;

var currentFormat = Fingerprint.SampleFormat.PngImage;
var deviceTechn = {
    0: "Unknown",
    1: "Optical",
    2: "Capacitive",
    3: "Thermal",
    4: "Pressure",
};
let data = [];

var deviceModality = {
    0: "Unknown",
    1: "Swipe",
    2: "Area",
    3: "AreaMultifinger",
};

var deviceUidType = {
    0: "Persistent",
    1: "Volatile",
};

let items = [];

var FingerprintSdkTest = (function () {
    function FingerprintSdkTest() {
        var _instance = this;
        this.operationToRestart = null;
        this.acquisitionStarted = false;
        this.sdk = new Fingerprint.WebApi();
        console.log("SDK Version: " + this.sdk.Version);
        console.log(this.sdk);

        this.sdk.onDeviceConnected = function (e) {
            // Detects if the deveice is connected for which acquisition started
            // showMessage("Scan your finger");
        };
        this.sdk.onDeviceDisconnected = function (e) {
            alert("Device disconnected");
            // Detects if device gets disconnected - provides deviceUid of disconnected device
            // showMessage("Device disconnected");
        };
        this.sdk.onCommunicationFailed = function (e) {
            alert("Communication Failed");
            // Detects if there is a failure in communicating with U.R.U web SDK
            // showMessage("Communinication Failed");
        };
        this.sdk.onSamplesAcquired = function (s) {
            // Sample acquired event triggers this function
            sampleAcquired(s);
        };
        this.sdk.onQualityReported = function (e) {
            // Quality of sample aquired - Function triggered on every sample acquired
            // document.getElementById("qualityInputBox").value =
            //     Fingerprint.QualityCode[e.quality];
        };
    }

    FingerprintSdkTest.prototype.startCapture = function () {
        if (this.acquisitionStarted)
            // Monitoring if already started capturing
            return;
        var _instance = this;
        // showMessage("");
        this.operationToRestart = this.startCapture;
        this.sdk.startAcquisition(currentFormat, myVal).then(
            function () {
                _instance.acquisitionStarted = true;

                //Disabling start once started
                // disableEnableStartStop();
            },
            function (error) {
                // showMessage(error.message);
            }
        );
    };
    FingerprintSdkTest.prototype.stopCapture = function () {
        if (!this.acquisitionStarted)
            //Monitor if already stopped capturing
            return;
        var _instance = this;
        this.sdk.stopAcquisition().then(
            function () {
                _instance.acquisitionStarted = false;

                //Disabling stop once stoped
                // disableEnableStartStop();
            },
            function (error) {
                // showMessage(error.message);
            }
        );
    };

    FingerprintSdkTest.prototype.getInfo = function () {
        var _instance = this;
        return this.sdk.enumerateDevices();
    };

    FingerprintSdkTest.prototype.getDeviceInfoWithID = function (uid) {
        var _instance = this;
        return this.sdk.getDeviceInfo(uid);
    };

    return FingerprintSdkTest;
})();

function compareImages(image1, image2) {
    // Placeholder function for comparing two images
    // You need to implement the actual comparison logic
    return image1 === image2; // This is just a placeholder, replace with actual comparison logic
}
window.onload = function () {
    test = new FingerprintSdkTest();
    readersDropDownPopulate(true); //To populate readers for drop down selection
    disableEnable();
    // onStart();
};

function readersDropDownPopulate(checkForRedirecting) {
    // Check for redirecting is a boolean value which monitors to redirect to content tab or not
    myVal = "";
    var allReaders = test.getInfo();
    allReaders.then(
        function (sucessObj) {
            myVal = sucessObj[0];
            disableEnable();
        },
        function (error) {
            showMessage(error.message);
        }
    );
}
function onStart() {
    test.startCapture();
}
function onStop() {
    test.stopCapture();
}

//Enable disable buttons
function disableEnable() {
    if (myVal != "") {
        disabled = false;
        onStart();
    } else {
        disabled = true;
        onStop();
    }
}
async function sampleAcquired(s) {
    var samples = JSON.parse(s.samples);
    let _sampleData = Fingerprint.b64UrlTo64(samples[0]);
    currentFingerPrint = _sampleData;
    // fetch users role student
    let fingerprints = [];
    await fetch("../api/users/list?key=student")
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                console.log(data);

                data.forEach((user, i) => {
                    if (user.finger_print)
                        fingerprints.push({
                            email: user.email,
                            id: user.id,
                            user: user.finger_print,
                        });
                });
            }
        });
    await fingerprints.forEach(async (fingerprint) => {
        let toPush = {
            id: fingerprint.id,
            png_base64: [],
        };
        await fingerprint.user.split(",").forEach(async (user, i) => {
            // localhost:8000/storage/fingerprints/student@gmail.com/1.png
            // link to base64

            await fetch(
                `https://lams-1-njuv.onrender.com/storage/fingerprints/${
                    fingerprint.email
                }/${user.trim()}`
            )
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        await toPush.png_base64.push(
                            reader.result.split(",")[1]
                        );
                        console.log(toPush.png_base64.length);
                        if (
                            toPush.png_base64.length == 5 &&
                            data.length === fingerprints.length
                        ) {
                            check(_sampleData);
                        }
                    };
                    reader.readAsDataURL(blob);
                });
        });
        data.push(toPush);
    });
    // python link of image to base64
    if (data.length > 0) {
    }
    // fetch("../api/attendances/today")
    //     .then((response) => response.json())
    //     .then((data) => {
    //         items = data;
    //         items.forEach((attendance, i) => {
    //             handleWritter(attendance, i);
    //         });
    //     });
}

let handleWritter = async (item, i) => {
    if (i === 0) {
        handleCard(item);
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
    let td = $("<td>");
    const logs = items.filter(
        (att) =>
            att.student_name === item.student_name &&
            att.com_no === item.com_no &&
            att.section_name === item.section_name &&
            att.status === "IN"
    );
    const isEven = logs.length % 2 === 0;
    const lastLog = items.filter(
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
};

let handleCard = async (item) => {
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
};
async function check(_sampleData) {
    // Use environment variable or fallback to production URL
    const API_URL = window.FINGERPRINT_API_URL || 'https://lams-fingerprint-api.onrender.com';
    
    await fetch(`${API_URL}/identify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            database: data,
            input: _sampleData,
        }),
    })
        .then((res) => res.json())
        .then(async (dd) => {
            fingerResult = dd;
            data = [];
            fetch("../api/attendances/today", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    items = data;
                    isIn = data.filter(
                        (att) => att.user_id === fingerResult.best_match
                    )[0];
                    if (dd.match_found && (isIn?.status === "OUT" || !isIn)) {
                        $("#com-modal").modal("show");
                    } else {
                        if (fingerResult.match_found) {
                            fetch("../api/attendances/save", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    user_id: fingerResult.best_match,
                                    status: "OUT",
                                    date: new Date()
                                        .toISOString()
                                        .split("T")[0],
                                    time: new Date().toLocaleTimeString(
                                        "en-GB",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }
                                    ),
                                    com_no: isIn.com_no,
                                }),
                            })
                                .then((res) => res.json())
                                .then((payload) => {
                                    items.unshift(payload);
                                    $("#card").empty();
                                    $("#tbody").empty();
                                    items.forEach((attendance, i) => {
                                        handleWritter(attendance, i);
                                    });
                                    $("#com-modal").modal("hide");
                                    Swal.fire({
                                        icon: "success",
                                        title: "Success",
                                        text: "Attendance has been recorded.",
                                    });
                                });
                        }
                    }
                    if (!dd.match_found) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Fingerprints do not match.",
                        });
                    }
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

async function handleComNo(no) {
    if (fingerResult.match_found) {
        await fetch("../api/attendances/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: fingerResult.best_match,
                status: isIn?.status === "IN" ? "OUT" : "IN",
                date: new Date().toISOString().split("T")[0],
                time: new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
                com_no: no,
            }),
        })
            .then((res) => res.json())
            .then((payload) => {
                items.unshift(payload);
                $("#card").empty();
                $("#tbody").empty();
                items.forEach((attendance, i) => {
                    handleWritter(attendance, i);
                });
                $("#com-modal").modal("hide");
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Attendance has been recorded.",
                });
            });
    } else {
    }
}
