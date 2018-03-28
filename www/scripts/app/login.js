/**
 * Login view model
 */

// iOS

function onNotificationAPN(event) {
    //alert('On notificationAPn');
    app.mobileApp.navigate('views/notifications.html');
    
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }

    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}
// Android and Amazon Fire OS
function onNotification(e) {
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                //app.showErrorWithTitle(e.regid, 'Attenzione!');
                addDeviceIdToUser(e.regid, true)
            }
            break;
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            //app.showErrorWithTitle(JSON.stringify(e), 'Fore ground Attenzione!');
            app.mobileApp.navigate('views/notifications.html');
            if (e.foreground) {
            } else { // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    //app.showErrorWithTitle(JSON.stringify(e), 'Cold Start Attenzione!');
                    $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                } else {
                    //  app.showErrorWithTitle(JSON.stringify(e), 'No Cold start Attenzione!');
                    $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }

            break;
        case 'error':
            $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;
        default:
            $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

function tokenHandler(token) {
    
    app.mobileApp.hideLoading();
    app.mobileApp.navigate('views/activitiesView.html');
    console.log('Success token:' + token);
    addDeviceIdToUser(token, false);
}

function successHandler(result) {
    app.mobileApp.hideLoading();
    app.mobileApp.navigate('views/activitiesView.html');
    console.log('Success token:' + result);
    addDeviceIdToUser(result, true);
}

function errorHandler(error) {
    alert('error getting token');
    app.mobileApp.hideLoading();

    app.mobileApp.navigate('views/activitiesView.html');
    console.log('Error: ' + error);
}

function addDeviceIdToUser(id, isAndroid) {
    $.ajax({
               url: appSettings.apiUrl + 'action=registerDevice',
               type: "POST",
               data: {
            'userid': appSettings.userId,
            'deviceId': id,
            'isAndroid': isAndroid ? 1 : 0,
        },
               success: function (result) {
                   console.log('Shared post ' + result);
                   result = JSON.parse(result);
               }
           });
}

function onNotificationGCM(e) {
    switch (e.event) {
        case 'registered':

            if (e.regid.length > 0) {
                addDeviceIdToUser(e.regid, true);
            }
            break;
        case 'message':

            if (e.foreground) {

            }
            break;
        case 'error':
            console.log('Error: ' + e.msg);
            break;
        default:
            console.log('An unknown event was received');
            break;
    }
}

function onPushNotificationReceived(e) {

};

function shareEmail() {
    
};

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {
     
        var isInMistSimulator = (location.host.indexOf('icenium.com') > 1);
        var $loginUsername;
        var $loginPassword;
        var validator;

        var isFacebookLogin = app.isKeySet(appSettings.facebook.redirectUri) && app.isKeySet(appSettings.facebook.adfsRealm);
        var isGoogleLogin = app.isKeySet(appSettings.google.clientId) && app.isKeySet(appSettings.google.redirectUri);
        var isLiveIdLogin = app.isKeySet(appSettings.liveId.clientId) && app.isKeySet(appSettings.google.redirectUri);
        var isAdfsLogin = app.isKeySet(appSettings.adfs.adfsRealm) && app.isKeySet(appSettings.adfs.adfsEndpoint);
        var isAnalytics = analytics.isAnalytics();
        var init = function () {

            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');
            validator = $('#login-form').kendoValidator({
                                                            validateOnBlur: false
                                                        }).data('mobileValidator');
        };

        var show = function () {
            
            $loginUsername.val('');
            $loginPassword.val('');
            $('.rememberme').click(function () {
                if ($('#rememberMe').is(':checked')) {
                    $('#rememberMe').removeAttr('checked');
                } else {
                    $('#rememberMe').prop('checked', 'checked');
                }
            });
                debugger;
            if (window.localStorage.getItem('isLoggedIn') != undefined && window.localStorage.getItem('isLoggedIn') == 'true') {

//                appSettings.userGroup = window.localStorage.getItem('userGroup');
//                appSettings.userId = window.localStorage.getItem('userId');
                appSettings.accessToken = window.localStorage.getItem('accessToken');
                appSettings.isLoggedIn = true;
                app.mobileApp.navigate('views/activitiesView.html');
            } else {
            }
        };
/*
1) mostrare dati negozio quando premo negozio
2) footer far vedere testo bottoni
3) aggiungere news
4) inserire nome gruppo quando apro lo sconto

*/
        // Authenticate to use Backend Services as a particular user
        var login = function () {
                debugger;            
            var username = $loginUsername.val();
            var password = $loginPassword.val();
            var group = $('#logingroup').val();
            var invito = $('#invito').val();

            /*if (validator.validate()) {*/
            if (true) {
                $('#login').removeClass('disabled');
                $('#login').removeAttr('disabled');

                app.mobileApp.showLoading();
                // Authenticate using the username and password
                $.ajax({
                           url: appSettings.apiUrl + 'action=login',
                           type: "POST",
                           cache: false,
                           data: {
                        username: username,
                        password: password,
                        invito: invito,
                        userGroup : parseInt(group),
                    },
                           success: function (result) {
                               

                               result = JSON.parse(result);
                               localStorage.setItem("contattaci",result.shopemail);
                               if (result.isLoggedIn == true) {
                                   appSettings.userGroup = result.userGroup;
                                   appSettings.userId = result.userId;
                                   appSettings.accessToken = result.access_token;
                                   appSettings.isLoggedIn = true;
                                   appSettings.contattaci = result.email;

                                   if ($('#rememberMe').is(':checked')) {
                                       window.localStorage.setItem("userGroup", appSettings.userGroup);
                                       window.localStorage.setItem("userId", appSettings.userId);
                                       window.localStorage.setItem("accessToken", appSettings.accessToken);
                                       window.localStorage.setItem("isLoggedIn", appSettings.isLoggedIn);
                                   }

                                   var pushNotification = window.plugins.pushNotification;
                                   
                                   if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
                                       pushNotification.register(
                                           successHandler,
                                           errorHandler, {
                                               "senderID": "336239507728",
                                               "ecb": "onNotification"
                                           });
                                   } else {
                                       pushNotification.register(
                                           tokenHandler,
                                           errorHandler, {
                                               "badge": "true",
                                               "sound": "true",
                                               "alert": "true",
                                               "ecb": "onNotificationAPN"
                                           });
                                   }
                                   app.mobileApp.navigate('views/activitiesView.html');
                                   app.mobileApp.hideLoading();
                               } else {
                                   app.mobileApp.hideLoading();
                                   app.showError('nome utente o password sbagliata.');
                               }
                           },
                           error: function (err) {
                              app.showError('WiFi non connesso / nome o la password è errata');
                              app.mobileApp.hideLoading();
                           }
                       });

            } else {
                $('#login').addClass('disabled');
                $('#login').attr('disabled');
                $('#loginUsername,#loginPassword').on('keyup keypress blur change input', function () {
                    if (validator.validate()) {
                        $('#login').removeClass('disabled');
                        $('#login').removeAttr('disabled');
                    } else {
                        $('#login').addClass('disabled');
                        $('#login').attr('disabled');
                    }
                });
            }
        };

        // Authenticate using Facebook credentials
        var loginWithFacebook = function () {
            
            app.mobileApp.showLoading();
            facebookConnectPlugin.login(["public_profile,email,publish_actions,user_photos"], function (response) { 

                if (response.status === 'connected') {

                    facebookConnectPlugin.api('me/?fields=name,email', ["public_profile", "email"],
                                              function (data) {
                                                  
                                                  var group = $('#logingroup').val();
                                                  var dataSource = kendo.observable({
                                                                                        Username: '',
                                                                                        Password: '',
                                                                                        DisplayName: '',
                                                                                        Email: '',
                                                                                        pictureurl: '',
                                                                                    });
                                                  dataSource.Username = data.email;
                                                  dataSource.DisplayName = data.name;
                                                  dataSource.Email = data.email;
                                                  dataSource.pictureurl = 'http://graph.facebook.com/' + data.id + '/picture?type=large';
                                                  dataSource.Password = 'abc123';
                                                  
                                                  $.ajax({
                                                             url: appSettings.apiUrl + 'action=facebookLogin',
                                                             type: "POST",
                                                             data: {
                                                          email: data.email,
                                                          name: data.name,
                                                          username: data.email,
                                                          userGroup : parseInt(group),
                                                          image_url: 'http://graph.facebook.com/' + data.id + '/picture?type=large',
                                                          type: 'user'
                                                      },
                                                             success: function (result) {
                                                                 result = JSON.parse(result);
                                                                 if (result.isLoggedIn == true) {
                                                                     appSettings.userGroup = result.userGroup;
                                                                     appSettings.userId = result.userId;
                                                                     appSettings.accessToken = result.access_token;
                                                                     appSettings.isLoggedIn = true;
                                                                     window.localStorage.setItem("userGroup", appSettings.userGroup);
                                                                     window.localStorage.setItem("userId", appSettings.userId);
                                                                     window.localStorage.setItem("accessToken", appSettings.accessToken);
                                                                     window.localStorage.setItem("isLoggedIn", appSettings.isLoggedIn);
                                                                     var pushNotification = window.plugins.pushNotification;
                                      
                                                                     if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
                                                                         pushNotification.register(
                                                                             successHandler,
                                                                             errorHandler, {
                                                                                 "senderID":"336239507728",
                                                                                 "ecb":"onNotification"
                                                                             });
                                                                     } else {
                                                                         pushNotification.register(
                                                                             tokenHandler,
                                                                             errorHandler, {
                                                                                 "badge":"true",
                                                                                 "sound":"true",
                                                                                 "alert":"true",
                                                                                 "ecb":"onNotificationAPN"
                                                                             });
                                                                     }
                                                                     app.mobileApp.hideLoading();
                                                                     app.mobileApp.navigate('views/activitiesView.html');
                                                                 } else {
                                                                     app.mobileApp.hideLoading();
                                                                     app.showError('nome utente o password sbagliata.');
                                                                 }
                                                             },
                                                             error: function (error) {
                                                                 
                                                             }
                                                         });
                                              },
                                              function () {
                                                  app.mobileApp.hideLoading();
                                              }
                        );
                } else {
                    app.mobileApp.hideLoading();
                }
            });
            

        };


        var showMistAlert = function () {
            alert(appSettings.messages.mistSimulatorAlert);
        };

        return {
            init: init,
            show: show,
            getYear: app.getYear,
            login: login,
            loginWithFacebook: loginWithFacebook
        };
    }());

    return loginViewModel;
}());