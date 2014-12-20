var myApp = {};

$(document).ready(function () {
    myApp = jQuery.parseJSON(localStorage.getItem('seguimiApp'));

    if (myApp === null)
        myApp = {};     // la prima volta

    myApp.globalCountSend = 0;
    myApp.globalCountGet = 0;
    myApp.allPosition = new Array();
    myApp.currentPosition = null;

    loadValue("elapsedTimeSend");
    loadValue("elapsedTimeGet");
    loadValue("urlAjax");
    $("#idBtnStop").prop('disabled', 'disabled');
    startGps();
    // document.addEventListener("deviceready", onDeviceReady, false);
    divHeight = (screen.height -20)/5;
    $("div").height(divHeight);

}
);

function startGps() {
    if (navigator.geolocation) {
        var options = {
            maximumAge: 5000,
            enableHighAccuracy: true
        };
        navigator.geolocation.watchPosition(savePosition, showErrorGps, options);
    } else {
        showErrorGps(0);
    }
}

function savePosition(position) {
    var dt = new Date();
    var newElem = {};
    newElem.nomeFile = dt.getFullYear() + "\\" + dt.getFullYear() + (dt.getMonth() + 1) + dt.getDate() + ".tab";
    newElem.lat = position.coords.latitude;
    newElem.lon = position.coords.longitude;
    newElem.vel = position.coords.speed;
    newElem.alt = position.coords.altitude;
    newElem.data = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    newElem.ora = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    myApp.currentPosition = newElem;
}

function getPosition() {
    if (myApp.currentPosition !== null) {
        // alert (JSON.stringify(myApp.currentPosition));
        myApp.allPosition.push(myApp.currentPosition);
        myApp.currentPosition = null;
        myApp.globalCountGet++;
        $("#counterGet").html(myApp.globalCountGet);
        setStatus("gpsIcon", "On");
    }
}

function onDeviceReady() {
    window.plugin.backgroundMode.disable();
    document.addEventListener("backbutton", onBackKeyDown, false);
}

// Handle the back button
//
function onBackKeyDown() {
    salvaApp();
}
function salvaApp() {
    localStorage.setItem('seguimiApp', JSON.stringify(myApp));
}

function changeField(quale) {
    myApp[quale] = $("#" + quale).val();
    salvaApp();
}

function onStart() {
    $("#urlAjax").prop('disabled', 'disabled');
    $("#elapsedTimeSend").prop('disabled', 'disabled');
    $("#elapsedTimeGet").prop('disabled', 'disabled');
    $("#idBtnStart").prop('disabled', 'disabled');
    $("#idBtnStop").prop('disabled', '');
    $("#submitIcon").show();

    debug("");
    myApp.timerVarSend = setInterval(function () {
        sendPosition();
    }, myApp.elapsedTimeSend);
    myApp.timerVarGet = setInterval(function () {
        getPosition();
    }, myApp.elapsedTimeGet);
    // window.plugin.backgroundMode.enable();
}


function onStop(tipo) {
    $("#urlAjax").prop('disabled', '');
    $("#idBtnStart").prop('disabled', '');
    $("#idBtnStop").prop('disabled', 'disabled');
    $("#elapsedTimeSend").prop('disabled', '');
    $("#elapsedTimeGet").prop('disabled', '');
    $("#submitIcon").hide();

    setStatus("gpsIcon", "");
    setStatus("ajaxIcon", "");
    if (tipo === 0) {
        myApp.globalCountSend = 0;
        myApp.globalCountGet = 0;
    }
    window.clearInterval(myApp.timerVarSend);
    window.clearInterval(myApp.timerVarGet);
    // window.plugin.backgroundMode.disable();
}

function sendPosition() {
    if (myApp.allPosition.length > 0) {
        $.ajax({
            type: "POST",
            timeout: 500,
            async: true,
            url: $("#urlAjax").val(),
            data: {allPosition: JSON.stringify(myApp.allPosition)}
        })
                .done(function (msg) {
                    if (msg === "OK") {
                        setStatus("ajaxIcon", "On");
                        myApp.globalCountSend += myApp.allPosition.length;
                        $("#counterSend").html(myApp.globalCountSend);
                        myApp.allPosition = new Array();
                        debug("");
                    }
                    else
                        debug("ERRORE:" + msg);
                })
                .fail(function (xhr, err) {
                    setStatus("ajaxIcon", "Off");
                    var responseTitle = $(xhr.responseText).filter('title').get(0);
                    debug($(responseTitle).text() + "\n" + formatErrorMessage(xhr, err));
                });
    }
}

function showErrorGps(error) {
    setStatus("gpsIcon", "Off");
    if (error === 0) {
        debug("GPS not available.");
    } else {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                debug("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                debug("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                debug("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                debug("An unknown error occurred.");
                break;
        }
    }
}

function formatErrorMessage(jqXHR, exception) {
    if (jqXHR.status === 0) {
        return ('Not connected.\nPlease verify your network connection.');
    } else if (jqXHR.status === 404) {
        return ('The requested page not found. [404]');
    } else if (jqXHR.status === 500) {
        return ('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        return ('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        return ('Time out error.');
    } else if (exception === 'abort') {
        return ('Ajax request aborted.');
    } else {
        return ('Uncaught Error.\n' + jqXHR.responseText);
    }
}

function debug(msg) {
    $("#currentPosition").html(msg);
}

function loadValue(whichValue) {
    if (typeof myApp[whichValue] === "undefined")
        myApp[whichValue] = $(("#" + whichValue)).val();
    else
        $(("#" + whichValue)).val(myApp[whichValue]);
}

function setStatus(image, status) {
    imageName = "#" + image;
    imageValue = "res/" + image + status + ".png";
    $(imageName).attr("src", imageValue);
}
