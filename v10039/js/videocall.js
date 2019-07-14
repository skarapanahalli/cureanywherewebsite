var callerType;
var embed;
var clientId = "demo";
var gruveoCallCode;
var embedLoaded = false;
function SendPrescription() {
    var doctorname = getParameterByName('dn').replace(/ /g, '');
    var mail = getParameterByName('ml');
    var bkc = getParameterByName('bkc');
    console.log(doctorname);
    console.log(mail);
    window.location.href = './pcapture.html?dn=' + doctorname + '&ml=' + mail + '&bkc=' + bkc;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function GruveoInit() {
    console.log("GruveoCallInit");
    embedLoaded = false;
    var tag = document.createElement("script");
    tag.src = "https://www.gruveo.com/embed-api/";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // This function gets called after the API code downloads. It creates
    // the actual Gruveo embed and passes parameters to it.
    var searchParams = new URLSearchParams(window.location.search);
    gruveoCallCode = searchParams.get("clientcallcode").substring(3);

    var isDoctor = searchParams.has('dn');
    callerType = "Patient";
    if (isDoctor) {
        callerType = "Doctor";
    }
}

function onGruveoEmbedAPIReady() {
    var myembed = document.getElementById('myembed');
    embed = new Gruveo.Embed("myembed", {
        responsive: 1,
        width: myembed.style.width,
        height: myembed.style.height,
        embedParams: {
            clientid: clientId,
            color: "034f0d",
            branding: 0,
            code: gruveoCallCode
        }
    });
    embed
        .on("error", onEmbedError)
        .on("requestToSignApiAuthToken", onEmbedRequestToSignApiAuthToken)
        .on("ready", onEmbedReady)
        .on("stateChange", onEmbedStateChange);
}

function onEmbedRequestToSignApiAuthToken(e) {

    var hashInBase64 = CryptoJS.HmacSHA256(e.token, "W62wB9JjW3tFyUMtF5QhRSbk").toString(CryptoJS.enc.Base64);
    embed.authorize(hashInBase64);

    //Initiated the call
    var logurl = "/VideoCallLog.html" + window.location.search + '&ct=' + callerType + '&cs=' + "EnteredRoom";
    updateCallStatus(logurl);
}

function onEmbedError(e) {
    console.error("Gruveo received error " + e.error + ".");
    var logurl = "/VideoCallLog.html" + window.location.search + '&ct=' + callerType + '&cs=' + "CallError:" + e.error;
    updateCallStatus(logurl);
}

function onEmbedReady(e) {
    console.log("embed ready, invoking embed.call");
    embed.call(gruveoCallCode, true);
    embedLoaded = true;
}

function onEmbedStateChange(e) {
    console.log("Onstatechange - CurrentState = " + e.state.toString());

    if (e.state == "call") {
        console.log("Call Started");
        var logurl = "/VideoCallLog.html" + window.location.search + '&ct=' + callerType + '&cs=' + "ConfStarted";
        updateCallStatus(logurl);

    }
    if (e.state == "ready") {
        var logurl = "/VideoCallLog.html" + window.location.search + '&ct=' + callerType + '&cs=' + "CallEnded";
        updateCallStatus(logurl);
    }
}

function updateCallStatus(logurl) {
    var xhr = new XMLHttpRequest();
    console.log(logurl);
    xhr.open("GET", logurl, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                //console.log(xhr.responseText);
                console.log("Successfully invoked the videocalllog.html");

            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);

}


function EnableSendPrescription() {
    console.log(window.location.href);

    var sendp = document.getElementById('SendPrescription');

    if (window.location.href.toLowerCase().indexOf("dn") > -1) {
        console.log('doctor opened url, enabling sendprescription');

        sendp.style.visibility = 'visible';
    }
    else {
        sendp.style.visibility = 'hidden';
    }
    sendp.scrollIntoView();
}

