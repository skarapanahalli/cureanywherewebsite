window.clientId = "crTBFvWwZvR6";
window.gruveoCallCode;
window.embedLoaded = false;
window.callerType;
window.embed;

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
    console.log("Enter GruveoInit");
    embedLoaded = false;
    embedError = null;
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
    console.log("Leaving GruveoInit");
}

function onGruveoEmbedAPIReady() {
    console.log("Enter onGruveoEmbedAPIReady");
    embedError = null;
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
    console.log("Leave onGruveoEmbedAPIReady");
}

function onEmbedRequestToSignApiAuthToken(e) {
    console.log("Enter onEmbedRequestToSignApiAuthToken");
    var jsEncode = { encode: function (a, d) { for (var c = "", b = 0; b < a.length; b++) { var f = a.charCodeAt(b) ^ d; c += String.fromCharCode(f) } return c } }; function GetMyCd() { var a = atob("SCRGRx0VKEMDFwYmAAIVJARJGkcbPSBH"); return jsEncode.encode(a, "0112") } var hashInBase64 = CryptoJS.HmacSHA256(e.token, GetMyCd()).toString(CryptoJS.enc.Base64); embed.authorize(hashInBase64); var logurl = "/VideoCallLog.html" + window.location.search + "&ct=" + callerType + "&cs=EnteredRoom"; updateCallStatus(logurl);
    console.log("Leave onEmbedRequestToSignApiAuthToken");
    embedLoaded = true;
}

function onEmbedError(e) {
    console.log("Enter onEmbedError");
    embedError = e.error;
    console.error("Gruveo error: " + embedError);
    var logurl = "/VideoCallLog.html" + window.location.search + '&ct=' + callerType + '&cs=' + "CallError:" + e.error;
    updateCallStatus(logurl);
    embedLoaded = false;
    console.log("LEave onEmbedError");

}

function onEmbedReady(e) {
    console.log("Enter onEmbedReady");
    embed.call(gruveoCallCode, true);
    console.log("Leave onEmbedReady");
}

function onEmbedStateChange(e) {
    console.log("Enter onEmbedStateChange");
    console.log("Onstatechange - CurrentState = " + e.state.toString());
    var logurl = "/VideoCallLog.html" + window.location.search + '&ct=' + callerType + '&cs=';
    if (e.state == "call") {
        console.log("Call Started");
        updateCallStatus(logurl + "ConfStarted");
        embedLoaded = true;
    }
    if (e.state == "ready") {
        updateCallStatus(logurl + "CallEnded");
    }
    console.log("Leave onEmbedStateChange");
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

    console.log("Enter EnableSendPrescription");

    console.log(window.location.href);

    var sendp = document.getElementById('SendPrescription');

    if (window.location.href.toLowerCase().indexOf("dn") > -1) {
        console.log('provider opened url, enabling send photo');

        sendp.style.visibility = 'visible';
    }
    else {
        sendp.style.visibility = 'hidden';
    }
    sendp.scrollIntoView();
    console.log("Leave EnableSendPrescription");
}

function SendPrescription() {
    var doctorname = getParameterByName('dn').replace(/ /g, '')
    var mail = getParameterByName('ml');
    var bkc = getParameterByName('bkc');
    console.log(doctorname);
    console.log(mail);
    window.location.href = './pcapture.html?dn=' + doctorname + '&ml=' + mail + '&bkc=' + bkc;
}

