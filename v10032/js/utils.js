window.browsername;
window.intervalId;
window.returnCode;
window.embedError;
window.iterations;
window.MAXITERATIONS = 10;
//var imported = document.createElement('script');
//imported.src = 'bowser.js';
//document.head.appendChild(imported);

//imported = document.createElement('script');
//imported.src = 'videocall.js';
//document.head.appendChild(imported);

function OnVideoCall() {
    if (checkWebRTCSupport()) {
        if (CheckParams()) {
            if (CheckDateValidity()) {
                GruveoInit();
                DisplayUserInfo();
                EnableSendPrescription();
            }
        }
    }
}

function checkWebRTCSupport() {
    if (CheckForAllowedBrowsers() == true) {

        var myembed = document.getElementById('myembed');
        myembed.style.visibility = 'visible';

        var unsupportedbrowser = document.getElementById('unsupportedbrowsermsg');
        var setdefaultbrowser = document.getElementById('setDefaultBrowsermsg');

        unsupportedbrowser.style.visibility = 'hidden';
        setdefaultbrowser.style.visibility = 'hidden';
        return true;
    }
    else {
        console.error('Not a supported browser version!');

        var sendp = document.getElementById('SendPrescription');
        sendp.style.visibility = 'hidden';

        var myembed = document.getElementById('myembed');
        myembed.style.visibility = 'hidden';

        var unsupportedbrowser = document.getElementById('unsupportedbrowsermsg');

        unsupportedbrowser.innerHTML = 'You are seeing this because, your default browser (' + browsername + ') is not compatible with this application! <br/>Please copy paste the [URL] into chrome OR try changing default browser to latest version of Chrome or Safari <br/>See relevant video below on how to set chrome as your default browser<br/>';

        unsupportedbrowser.style.visibility = 'visible';

        var setdefaultbrowser = document.getElementById('setDefaultBrowsermsg');

        setdefaultbrowser.innerHTML = 'Set Chrome as default browser in Xioami/Redmi mobiles</br><iframe width="256" height="144" src="https://www.youtube.com/embed/cVdoJzuN5WM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></br></br>Set Chrome as default browser on Samsung mobiles</br><iframe width="256" height="144" src="https://www.youtube.com/embed/_UW9kd9xI6o" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></br></br>Set Chrome as default browser in Realme mobiles</br><iframe width="256" height="144" src="https://www.youtube.com/embed/e6r5U-sLU0Q" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></br></br>Set Chrome as default browser on Android mobiles</br><iframe width="256" height="144" src="https://www.youtube.com/embed/De8R7ayt5wM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';

        setdefaultbrowser.style.visibility = 'visible';

        var modal = document.getElementById('modalMsg');
        modal.style.visibility = 'hidden';

        return false;
    }


    // if(returnCode == false)
    // {
    // var sendp = document.getElementById('SendPrescription');
    // sendp.style.visibility = 'hidden';

    // var myembed = document.getElementById('myembed');
    // myembed.style.visibility = 'hidden';

    // var usermsg = document.getElementById('UserMessage');
    // usermsg.style.visibility = 'hidden';

    // var unsupportedbrowser = document.getElementById('unsupportedbrowsermsg');
    // unsupportedbrowser.style.visibility = 'visible';
    // }
    // return returnCode;
}

function getMetaContentByName(name, content) {
    var content = (content == null) ? 'content' : content;
    return document.querySelector("meta[name='" + name + "']").getAttribute(content);
}

function ShowVersionOnMultiPress() {

    document.addEventListener('dblclick', function (e) {
        // if (e.detail == 1)
        // {
        var version = getMetaContentByName('version');
        var copyrightmsg = 'CureAnywhere - Copyrights 2019. All Rights Reserved. Version: ';
        alert(copyrightmsg + version);
        //}
    });
}
/* // Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
   const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream; 
  returnCode = true;
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    let v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`; 
  if (typeof error !== 'undefined') {
    console.error(error);
	console.log (msg);
	returnCode = false;
  }
}
 function userMedia() {
	navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError); 
 }    
  */
function CheckParams() {
    var field = 'clientcallcode';
    var url = window.location.href.toLowerCase();

    if (url.indexOf('?') != -1) {
        if (url.indexOf(field + '=') != -1) {
            field = 'dt';
            if (url.indexOf(field + '=') != -1) {
                return true;
            }
        }
    }
    alert('URL does not have mandatory parameters!');

    document.body.innerHTML = '</br/></br><b>Check the URL, it does not seem to have required parameters!</b>';

    return false;
}

function CheckDateValidity() {
    var searchParams = new URLSearchParams(window.location.search);
    apptDateRec = searchParams.get("dt");

    if (apptDateRec) { //18-11-2018
        var dtsplit = apptDateRec.split("-")
        var appDateFormatted = new Date(dtsplit[2], dtsplit[1] - 1, dtsplit[0]);
        var curDate = new Date();
        curDate.setHours(0, 0, 0, 0);
        if (appDateFormatted.valueOf() == curDate.valueOf()) {
            return true;
        }
        else {
            var sendp = document.getElementById('SendPrescription');
            sendp.style.visibility = 'hidden';

            var modal = document.getElementById('modalMsg');
            modal.style.visibility = 'hidden';

            var unsupportedbrowser = document.getElementById('unsupportedbrowsermsg');
            unsupportedbrowser.style.visibility = 'visible';

            unsupportedbrowser.innerHTML = '</br/></br><b>Either you are trying to start this call ahead of time OR the appointment has expired, try at the start time of the appointment !</b>';
        }
    }
    return false;
}

function DisplayUserInfo() {
    console.log("Enter DisplayUserInfo");
    // Get the modal
    var modal = document.getElementById('modalMsg');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("closeX")[0];

    // Get the <span> element that closes the modal
    var closebtn = document.getElementById("closeBtn");

    var mainvideoregion = document.getElementsByClassName("MainVideoRegion")[0];

    var infomsg = document.getElementById('InfoMessage');

    if (window.location.href.toLowerCase().indexOf("dn") > -1) {
        infomsg.innerHTML = "1. Insist the other party to use headphones for privacy and better clarity.<br/><br/>2. Click 'Send Photo/file' after your call to send any photo/file to the other person.";
    }
    else {
        infomsg.innerHTML = "1. Please wait on the call until the other party joins. <br/><br/>2. ALWAYS use headphones for better clarity.<br/><br/>3. Try to be in a well lit room for the video call.";
    }

    closebtn.disabled = true;
    closebtn.onclick = function () {
        modal.style.display = "none";
        mainvideoregion.style.display = 'block';
        if (embedLoaded) {
            embed.toggleFullscreen(true);
        }
    };

    span.disabled = true;
    span.onclick = function () {
        modal.style.display = "none";
        mainvideoregion.style.display = 'block';
        embed.toggleFullscreen(true);
    };

    iterations = 0;
    intervalId = setInterval(maximizeScreen, 3000);

    console.log("Leave DisplayUserInfo");
}

function maximizeScreen() {
    console.log("Enter maximizeScreen");
    var closebtn = document.getElementById("closeBtn");
    var span = document.getElementsByClassName("closeX")[0];
    var infomsg = document.getElementById('InfoMessage');

    console.log("iterations=" + iterations.toString());
    if (iterations++ == 0) {
        closebtn.innerText = "Loading please wait..";
        console.log("Leave maximizeScreen");
        return;
    }
    if (embedLoaded) {
        clearInterval(intervalId);
        closebtn.disabled = false;
        span.disabled = false;
        closebtn.innerText = "Join Video call";
        console.log("Join Video call enabled");
    } else {
        if (embedError == null) {
            closebtn.innerText = closebtn.innerText + ".";
            if (iterations >= MAXITERATIONS) {
                clearInterval(intervalId);
                closebtn.disabled = true;
                span.disabled = true;
                infomsg.innerHTML = "<font color=\"red\">Unable to initiate the video call, please contact your provider !</font>";
                closebtn.innerText = "Error Code: " + "Time out!";
                var sendp = document.getElementById('SendPrescription');
                sendp.style.visibility = 'hidden';
                embed.end();
            }
        }
        else {
            console.log("embedError is not null");
            clearInterval(intervalId);
            closebtn.disabled = true;
            span.disabled = true;
            closebtn.innerText = "Error Code: " + embedError;

            var sendp = document.getElementById('SendPrescription');
            sendp.style.visibility = 'hidden';

            infomsg.innerHTML = "<font color=\"red\">Error in video connection, try again & check with your provider !</font>";
        }
    }
    console.log("Leave maximizeScreen");
}

function CheckForAllowedBrowsers() {
    // Opera 8.0+
    /* 	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
    
        // Safari 3.0+ "[object HTMLElementConstructor]" 
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    
        // Internet Explorer 6-11
        var isIE = 		false || !!document.documentMode;								//@cc_on!@
    
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
    
        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;
    
        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;
    
        if (isSafari)
        {
            var objBrMajorVersion = parseInt(navigator.appVersion,10); 
            if (parseInt(objBrMajorVersion, 10) < 11)
            {
                isSafari = false;
            }
        }
        return (isChrome || isSafari) 
    	
            false || !!document.documentMode; */

    //bowser = require('bowser');
    var isChrome = (bowser.chrome == undefined ? 'false' : bowser.chrome);
    if (isChrome == true) {
        browsername = bowser.name + ' Version ' + bowser.version;
        return (bowser.version >= 70);
    }
    var isSafari = (bowser.safari == undefined ? 'false' : bowser.safari);
    if (isSafari == true) {
        browsername = bowser.name + ' Version ' + bowser.version;
        return (bowser.version >= 11.0);
    }
    browsername = bowser.name + ' Version ' + bowser.version;
    console.log('this application does not support ' + bowser.name + ' ' + bowser.version);
    return false;

}

function OnPageLoad() {
    console.log('onpageload');
    var throttle = false;
    document.body.addEventListener('click', function (evt) {

        if (!throttle && evt.detail == 4) {
            console.log('3 clicks');
            throttle = true;
            var version = getMetaContentByName('version');
            var copyrightmsg = 'CureAnywhere - Copyrights 2019. All Rights Reserved. Version: ';
            alert(copyrightmsg + version);
            alert(window.location.href);
            throttle = false;
        }
    });
}