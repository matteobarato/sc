var app = (function (win) {
    'use strict';

    // Global error handling
    var showAlert = function (message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };
    var api = function (action, callback, error, method, data) {
        $.ajax({
                   url: appSettings.apiUrl + action,
                   type: method || 'get',
                   data: data || {},
                   cache: false,
            
                   success: function (result) {
                       callback && callback(result);
                   },
                   error: function (err) {
                       error && error(err);
                   }
               });
        
    };
    var showError = function (message) {
        showAlert(message, 'Error occured');
    };

    var showErrorWithTitle = function (message, title) {
        showAlert(message, title);
    };

    var shareEmail = function () {
        debugger;
        alert("shareEmail");
    };

    win.addEventListener('error', function (e) {
        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        showAlert(message, 'Error occured');

        return true;
    });

    // Global confirm dialog
    var showConfirm = function (message, title, callback) {
        navigator.notification.confirm(message, callback || function () {
        }, title, ['OK', 'Cancel']);
    };

    var isNullOrEmpty = function (value) {
        return typeof value == 'undefined' || value == null || value == '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[Z_]\$$/;
        return isNullOrEmpty(key) && regEx.test(key);
    };

    // Handle device back button tap
    var onBackKeyDown = function (e) {
        e.preventDefault();
        if ($('#dashboardidentifier').length > 0 || $('#welcome').length > 0) {
            //alert('exiting app');
            navigator.notification.confirm('Vuoi davvero uscire?', function (confirmed) {
                var exit = function () {
                    navigator.app.exitApp();
                };
                if (confirmed === true || confirmed === 1) {
                    exit();
                }
            }, 'Exit', ['sì', 'Annulla']);
        } else {
            history.back();
        }
    };

    var toldAboutOffline = false;
    var onDeviceReady = function () {
        
        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);
        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onOnline, false);
       
        function onOffline() {
            // Handle the offline event
            if (!toldAboutOffline) {
                toldAboutOffline = true;
                app.showErrorWithTitle('Connessione 3G / Wifi assente', 'Avviso');
            }
        }

        function onOnline() {
            // Handle the online event
            toldAboutOffline = false;
        }
        if (device.platform === 'iOS' && parseFloat(device.version) >= 7.0) {
            document.body.style.marginTop = "25px"
            ; 
        }
        navigator.splashscreen.hide();
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

    var everliveOptions = {
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    };

    if (appSettings.everlive.url) {
        everliveOptions.url = appSettings.everlive.url;
    }

    // Initialize Everlive SDK
    var el = new Everlive(everliveOptions);

    var emptyGuid = '00000000-0000-0000-0000-000000000000';

    var AppHelper = {

        // Return user profile picture url
        resolveProfilePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return 'styles/images/avatar.png';
            }
        },

        // Return current activity picture url
        resolvePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return '';
            }
        },

        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {
            return kendo.toString(new Date(dateString), 'MM/dd/yyyy');
        },

        // Current user logout
        logout: function () {
            return el.Users.logout();
        },

        autoSizeTextarea: function () {
            var rows = $(this).val().split('\n');
            $(this).prop('rows', rows.length + 1);
        }
    };

    var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
                                                     transition: 'slide',
                                                     statusBarStyle: statusBarStyle,
                                                     skin: 'flat'
                                                 });

    return {
        showAlert: showAlert,
        showError: showError,
        showConfirm: showConfirm,
        isKeySet: isKeySet,
        mobileApp: mobileApp,
        helper: AppHelper,
        api: api,
        showErrorWithTitle: showErrorWithTitle,
        shareEmail: shareEmail,
        everlive: el
    };
}(window));