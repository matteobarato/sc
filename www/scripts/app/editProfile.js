var pictureSource;   // picture source
var destinationType;

// sets the format of returned value 
function base64toBlob(base64Data, contentType) {
    contentType = contentType || 'image/png';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);
        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset)
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}
function PostImageToFacebook(authToken) {
    var canvas = document.getElementById("c");
    var imageData = canvas.toDataURL("image/png");
}

document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready to be used!
//
function onDeviceReady() {
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess1(imageData) {
    // Get image handle
    //
    var smallImage = document.getElementById('largeImage');
    var imageHiddenValue = document.getElementById('imageValue');

    smallImage.style.display = 'block';
    smallImage.src = "data:image/png;base64," + imageData;
    imageHiddenValue.value = imageData;
}
    
// Called when a photo is successfully retrieved
//
function onPhotoFileSuccess(imageData) {
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageData;

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
        var largeImage = document.getElementById('largeImage');
       
        largeImage.style.display = 'block';

        // Show the captured photo
        // The inline CSS rules are used to resize the image
        //
        largeImage.src = imageURI;
    }
}

// A button will call this function

// Called if something bad happens.
// 
function onFail(message) {
    console.log('Failed because: ' + message);
}

/**
 * Activity view model
 */

var app = app || {};

app.EditProfile = (function () {
    'use strict'
    
    var activityViewModel = (function () {
        var errorElement ;
        var shareActivity = function() {
        };
        var init = function () {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
            errorElement = document.getElementById('textAreaError');
            app.mobileApp.showLoading();
            $.ajax({
                       url: appSettings.apiUrl + 'action=userprofile&userid=' + appSettings.userId,
                       type:"POST",
                       data:{},
                       success:function(result) {

                           app.mobileApp.hideLoading();
                           result = JSON.parse(result);

                           document.getElementById('imageValue').value = result.result.image_url;
                           document.getElementById('signupBirthDatePicker').value = result.result.dob;
                           document.getElementById('largeImage').style.display = 'block';
                           document.getElementById('largeImage').src = appSettings.projectUrl + result.result.image_url;
                           document.getElementById('eidtemail').value = result.result.email;
                           document.getElementById('editusername').value = result.result.username;
                           document.getElementById('signupPassword').value = result.result.password;
                           document.getElementById('name').value = result.result.name; 

                       },error:function(err) {
                           app.mobileApp.hideLoading();
                       }
                   });
            $('#signupPassword').bind('change', function() {
                $("#passwordError").show();

                if (this.value.length < 1 || this.value.length > 5) {
                    $("#passwordError").hide();
                }
            });
        };
        
        var show = function (e) {
        };
        
        var removeActivity = function () {
            var activities = app.Activities.activities;
            var activity = activities.getByUid(activityUid);
            
            app.showConfirm(
                appSettings.messages.removeActivityConfirm,
                'Delete Activity',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        activities.remove(activity);
                        activities.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        activities.sync();
                    }
                }
                );
        };
        //
        var capturePhotoWithData = function capturePhotoWithData() {
            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(onPhotoDataSuccess1, onFail, { quality: 70 ,destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true, targetWidth: 1364, targetHeight: 1364 });
        }

        var capturePhotoWithFile = function capturePhotoWithFile() {
            navigator.camera.getPicture(onPhotoDataSuccess1, onFail, { quality: 70, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM });
        }
        var test = function test() {
            alert('test');
        }
    
        // A button will call this function
        //
        var getPhoto = function getPhoto(source) {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                                            quality: 70, 
                                            destinationType:Camera.DestinationType.FILE_URI,
                                            sourceType: source
                                        });
        }
        var postProfileData = function() {
            debugger;
            var Name = document.getElementById('name').value;
            var date = document.getElementById('signupBirthDatePicker').value;
            var Email = document.getElementById('eidtemail').value;
            
            var pictureUrl = document.getElementById('imageValue').value;

            var Username = document.getElementById('editusername').value;
            var Password = document.getElementById('signupPassword').value;
            
            
            if (Password != '' && Password.length < 6) {
                app.showErrorWithTitle('Password must be atleatst 6 character.');
            } else {
                app.mobileApp.showLoading();
                $.ajax({
                           url: appSettings.apiUrl + 'action=updateProfile',
                           type:"POST",
                           data:{ password:Password , image:pictureUrl, name :Name,dob:date , user_id:appSettings.userId,Email:Email,Username:Username },
                           success:function(result) {
                               if(result === "0" || result === "1" ){
                                app.mobileApp.hideLoading();
                                app.mobileApp.navigate('views/profile.html');
                               }
                               else{
                                app.mobileApp.hideLoading();
                                 app.showErrorWithTitle(result);
                               }
                           },error:function(err) {
                               app.mobileApp.hideLoading();
                               
                           }
                       });
            }
        }
        
        return {
          
            init: init,
            show: show,
            getPhoto: getPhoto,
            capturePhotoWithFile : capturePhotoWithFile,
            capturePhotoWithData:capturePhotoWithData,
            sharePhoto : postProfileData,
            activity: function () {
                return activity;
            }
        };
    }());
    
    return activityViewModel;
}());