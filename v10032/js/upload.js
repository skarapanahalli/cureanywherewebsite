function UploadToS3() {

    document.body.style.cursor = 'wait';

    AWS.config.update({

    });
    AWS.config.region = 'us-east-1';

    var bucket = new AWS.S3({ params: { Bucket: 'prescriptionarchive' } });

    //var fileChooser = document.getElementById('file-chooser');
    var results = document.getElementById('results');

    //var file = fileChooser.files[0]; 
    if (selectedFile) {
        results.innerHTML = '</br>Uploading the photo, please wait...';

        var doctorname = getParameterByName('dn');
        var mail = getParameterByName('ml');
        var bkc = getParameterByName('bkc');
        console.log(doctorname);
        console.log(mail);
        console.log(bkc);

        var d = new Date();
        var ext = "jpg";
        if (selectedFile instanceof File) { //else it is an image not selected file
            ext = selectedFile.slice((selectedFile.lastIndexOf(".") - 1 >>> 0) + 2);
        }
        var filename = d.toISOString().replace(/:/g, "-") + '_' + bkc + '.' + ext;

        var params = { Key: filename, ContentType: 'image/jpeg', Body: selectedFile, Metadata: { 'DoctorName': doctorname, 'Email': mail, 'bkc': bkc } };
        bucket.upload(params, function (err, data) {
            results.innerHTML = err ? 'ERROR!' : '</br>The photo/file sent successfully!'
            document.body.style.cursor = 'pointer';

        });
    } else {
        results.innerHTML = 'Please take a photo or select a picture !';

    }
    document.body.style.cursor = 'pointer';
}


function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
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
