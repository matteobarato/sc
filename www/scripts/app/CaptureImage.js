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
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}
function PostImageToFacebook(authToken) {
    var canvas = document.getElementById("c");
    var imageData = canvas.toDataURL("image/png");
}

function shareImage(pictureUrl, Description, points, authToken) {
    var userId = 'me';
    var pic = base64toBlob(pictureUrl);
    var fd = new FormData();
    fd.append("access_token", authToken);
    fd.append("source", pic);
    fd.append("caption", Description);
    var tags = [];
    //{tag_uid:874155352666942,x:1,y:1}
    //tags .push({tag_uid:'100002347955858',x:1,y:1});// rizwan ashraf
    //tags .push({tag_uid:'100000945215242',x:1,y:1}); //luca 
    tags .push({tag_uid:'129914510547963',x:1,y:1}); // scapin restaurant 129914510547963
    //tags .push({tag_uid:'1648454418770854',x:1,y:1}); // scapin Test
    tags = JSON.stringify(tags);
    console.log(tags);
    //fd.append("place", '1648454418770854');
    fd.append("place", '129914510547963');
    fd.append("tags", tags);
   
    try {
        $.ajax({
                   url:"https://graph.facebook.com/me/photos?access_token=" + authToken,
                   type:"POST",
                   data:fd,
                   processData:false,
                   contentType:false,
                   cache:false,
                   success:function(data) {
                       debugger;
                       var photo = data.id;
                       var post = data.post_id;
                      
                       $.ajax({
                                  url: appSettings.apiUrl + 'action=updateSocialPoints',
                                  type:"POST",
                                  data:{ 'userid': appSettings.userId, 'socialPoints': points },
                                  success:function(result) {
                                      console.log('Shared post ' + result);
                                      result = JSON.parse(result);
                                      if (result == "success") {
                                          document.getElementById('imageValue').value = '';
                                          document.getElementById('imageDescription').value = '';
                                          document.getElementById('largeImage').src = '';
                                          app.mobileApp.navigate('views/activitiesView.html');
                                          app.mobileApp.hideLoading();
                                          $("#scroller").data("kendoMobileScroller").animatedScrollTo(0, 0);
                                          app.showErrorWithTitle('Foto caricata con successo!', 'Complimenti!');
                                      }else {
                                          document.getElementById('imageValue').value = '';
                                          document.getElementById('imageDescription').value = '';
                                          document.getElementById('largeImage').src = '';
                                          app.mobileApp.hideLoading();
                                          $("#scroller").data("kendoMobileScroller").animatedScrollTo(0, 0);
                                          app.mobileApp.navigate('views/activitiesView.html');
                                      }
                                  },error : function(error) {
                                      app.mobileApp.hideLoading();
                                     $("#scroller").data("kendoMobileScroller").animatedScrollTo(0, 0);
                                  }
                              });

                   },
                   error:function(shr, status, data) {
                       debugger;
                       app.mobileApp.hideLoading();
                       console.log("error " + data + " Status " + shr.status);
                   },
                   complete:function() {
                   }
               });
    }catch (e) {
        console.log(e);
    }
   
}
// Wait for PhoneGap to connect with the device
//
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready to be used!
//
function onDeviceReady() {
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Get image handle
    debugger;
    app.mobileApp.showLoading();
    var smallImage = document.getElementById('largeImage');
    var imageHiddenValue = document.getElementById('imageValue');

    smallImage.style.display = 'inline-block';
    smallImage.src = "data:image/png;base64," + imageData;
    imageHiddenValue.value = imageData;
    $.ajax({
               type: "POST",
               url: 'http://www.hellocreativestudio.it/scapin/watermark.php',
  
               data: {image:imageData},
               success: function(result) {
                   smallImage.src = "data:image/png;base64," + result; 
                   imageHiddenValue.value = result;
                   app.mobileApp.hideLoading();
               }, error: function(err) {
                   app.mobileApp.hideLoading();
               }
           });
}
    
// Called when a photo is successfully retrieved
//
function onPhotoFileSuccess(imageData) {
    // Get image handle
    // Get image handle
    //
    debugger;
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'inline-block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageData;

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
        var largeImage = document.getElementById('largeImage');
       
        largeImage.style.display = 'inline-block';

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

app.Capture = (function () {
    'use strict'
    
    var activityViewModel = (function () {
        var errorElement ;
        var shareActivity = function() {
        };
        var init = function () {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
            errorElement = document.getElementById('textAreaError');
	    	
            
            $('#imageDescription').bind('input propertychange', function() {
                $("#textAreaError").show();

                if (this.value.length) {
                    $("#textAreaError").hide();
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
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 70 ,destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true, targetWidth: 1364, targetHeight: 1364 });
        }

        var capturePhotoWithFile = function capturePhotoWithFile() {
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 70, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM });
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
        var sharePhoto = function() {

            /*qui*/
            $.ajax({
               type: "POST",
               url: appSettings.apiUrl + 'action=check_shared_photo',
               data: { 'userid': appSettings.userId},
               success: function(result) {
                   result=JSON.parse(result);
                   if(result.msg=='forbid')
                    {alert("non è possibile caricare più di 5 foto al giorno");return;}

            var pictureUrl = document.getElementById('imageValue').value;
            var Description = document.getElementById('imageDescription').value;
            if (pictureUrl === '') {
                app.showErrorWithTitle('Si prega di scattare una foto.', 'Attenzione!');
            } else if (Description === '') {
                var errorElement = document.getElementById('textAreaError');
                errorElement.style.display = 'inline-block';
            } else {
                app.mobileApp.showLoading();
                var points = 5;
           
                facebookConnectPlugin.getLoginStatus(function(loginstatus) {
                    if (loginstatus.status ==='connected') {
                        shareImage(pictureUrl, Description, points, loginstatus.authResponse.accessToken);
                    } else {
                        facebookConnectPlugin.login(["public_profile,email,publish_actions,user_photos"],
                                                    function (response) {
                                                        if (response.status === 'connected') {
                                                            shareImage(pictureUrl, Description, points, response.authResponse.accessToken);
                                                        } else {
                                                            app.mobileApp.hideLoading();
                                                        }
                                                    }, function(error) {
                                                        app.mobileApp.hideLoading();
                                                    });
                    }
                }, function(error) {
                    app.mobileApp.hideLoading();
                });
            }




               }
           });

       }
        
        return {
          
            init: init,
            show: show,
            getPhoto: getPhoto,
            capturePhotoWithFile : capturePhotoWithFile,
            capturePhotoWithData:capturePhotoWithData,
            shareActivity : shareActivity,
            sharePhoto : sharePhoto,
            activity: function () {
                return activity;
            }
        };
    }());
    
    return activityViewModel;
}());