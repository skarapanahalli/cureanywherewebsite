//var myBlob;
var selectedFile;
var vWidth;
var vHeight;
var isImage;

function ShowCameraFeed() {
    function userMedia() {
        return navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia || null;

    }
    var imageLoader = document.getElementById('hiddenFilePicker');
    imageLoader.addEventListener('change', handleImage, false);
    // Now we can use it
    if (userMedia()) {

        var constraints = {
            video: { facingMode: "environment" },
            audio: false
        };
        var v = document.getElementById('video');



        var promise = navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                /* use the stream */
                var url = window.URL || window.webkitURL;

                // create the url and set the source of the video element
                //v.src = url ? url.createObjectURL(stream) : stream;
                v.srcObject = stream;
                v.onplaying = function () {
                    vWidth = v.videoWidth;
                    vHeight = v.videoHeight;

                    var centertxt = document.getElementById('centerText');
                    centertxt.innerHTML = '';

                    var capturebtn = document.getElementById('capture');
                    capturebtn.style.display = 'inline-block';

                    var sendtopatient = document.getElementById('SendToPatient');
                    sendtopatient.style.display = 'none';
                };
            })
            .catch(function (err) {
                /* handle the error */
                console.log("ERROR");
                console.log(err);

            });



        /*         var media = navigator.getUserMedia(constraints, function (stream) {
                    // URL Object is different in WebKit
                    var url = window.URL || window.webkitURL;
        
                    // create the url and set the source of the video element
                    //v.src = url ? url.createObjectURL(stream) : stream;
                    v.srcObject = stream;
        
                    // Start the video
                    //v.play();
                	
                	
                    v.onplaying = function() {
                        vWidth = v.videoWidth ;
                        vHeight = v.videoHeight;
                    	
                        var centertxt = document.getElementById('centerText');
                        centertxt.innerHTML = '';
                    	
                    };
                }, function (error) {
                    console.log("ERROR");
                    console.log(error);
                }); */
    } else {
        console.log("No WebRTC support!");
        alert('no webrtc');
    }
}

function Capture() {

    var ct = document.getElementById('centerText');
    ct.style.visibility = 'hidden';

    var imageLoader = document.getElementById('hiddenFilePicker');
    imageLoader.addEventListener('change', handleImage, false);

    var v = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    canvas.height = vHeight;
    canvas.width = vWidth;
    //canvas.height = v.height;
    //canvas.width= v.width;
    var context = canvas.getContext('2d');
    context.drawImage(v, 0, 0);
    v.style.visibility = 'hidden';
    canvas.style.visibility = 'visible';
    // canvas.style.right = '0';
    // canvas.style.bottom = '0';
    // canvas.style.minwidth = '100%';
    // canvas.style.minheight = '100%';
    //var imgAsDataURL = canvas.toDataURL('image/webp');

    //var img = document.getElementById('screenshot');

    var checkBox = document.getElementById("UpLoadExisting");
    checkBox.checked = false;

    var results = document.getElementById('results');
    results.innerHTML = '<br/><i>Refresh(pull page down) to recapture</i>';

    canvas.toBlob(function (blob) {
        selectedFile = blob;
    });
    /*     img.setAttribute('src', imgAsDataURL);
        img.style.visibility = 'visible';
                	
        img.style.height = v.style.height;
        img.style.width = v.style.width;
        v.style.visibility = 'hidden'; */

    var capturebtn = document.getElementById('capture');
    capturebtn.style.display = 'none';

    var sendtopatient = document.getElementById('SendToPatient');
    sendtopatient.style.display = 'inline-block';

    resizeToFit();
}

function resizeToFit() {
    var videoregion = document.getElementById("video");
    var canvasregion = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    canvasregion.style.height = '100%';
    canvasregion.style.width = '100%';

}
function UploadExistingFile() {
    console.log("UploadExistingFile-entry");
    var imageLoader = document.getElementById('hiddenFilePicker');
    var capturebtn = document.getElementById('capture');
    var checkBox = document.getElementById("UpLoadExisting");
    if (checkBox.checked == true) {
        isImage = false;
        imageLoader.click();
    }
    console.log("UploadExistingFile-exit");

}


function handleImage(e) {
    console.log("handleImage-Enter");
    var reader = new FileReader();
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    reader.onload = function (event) {
        console.log("Onload-Entry");
        var img = new Image();
        img.onload = function () {
            c.width = img.width;
            c.height = img.height;
            //fullscreenify(c);
            ctx.drawImage(img, 0, 0);
            //canvas.toBlob(function (blob) {
            //    myBlob = blob;
            //});

            var v = document.getElementById('video');
            v.style.visibility = 'hidden';
            var ct = document.getElementById('centerText');
            ct.style.visibility = 'hidden';
            console.log("onload-Exit");
        };

        if (isImage) {
            img.src = event.target.result;
        }
        else {
            img.src = '/images/file.png';
        }
        resizeToFit();
        var capturebtn = document.getElementById('capture');
        capturebtn.style.display = 'none';

        var sendtopatient = document.getElementById('SendToPatient');
        sendtopatient.style.display = 'inline-block';

        var results = document.getElementById('results');
        results.innerHTML = '<br/><i>Click [Send] to send this image to the other person</i>';

        var checkBox = document.getElementById("UpLoadExisting");
        checkBox.checked == false;
    }

    const file = e.target.files[0];
    selectedFile = file;
    const fileType = file['type'];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/bmp', 'image/tiff'];
    //, 'text/plain', 'application/zip', 'application/x-7z-compressed', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/x-rar-compressed', 'application/msword', 'text/html', 'video/mpeg', 'application/vnd.oasis.opendocument.presentation', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/x-msvideo'];
    if (validImageTypes.includes(fileType)) {
        isImage = true;
    }

    reader.readAsDataURL(e.target.files[0]);
    console.log("handleImage-Exit");
}

function fullscreenify(canvas) {
    var style = canvas.getAttribute('style') || '';

    window.addEventListener('resize', function () { resize(canvas); }, false);

    resize(canvas);

    function resize(canvas) {
        var scale = { x: 1, y: 1 };
        scale.x = (window.innerWidth - 10) / canvas.width;
        scale.y = (window.innerHeight - 10) / canvas.height;

        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }

        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
}