/**
 * Activity view model
 */

var app = app || {};

app.logout = (function () {
    'use strict'
    
    var activityViewModel = (function () {
        var activityUid,
            activity,
            $activityPicture;
     
        var init = function () {
            window.history.forward();
            app.mobileApp.showLoading();
        };
        
        var show = function (e) {
            if (window.navigator.simulator != true) {
                //running in the simulator
              //  facebookConnectPlugin && facebookConnectPlugin.logout(function() {
               // }, function() {
                //});
            }
           
            setTimeout(function() { 
                appSettings.userGroup = '';
                appSettings.userId = 0;
                appSettings.accessToken = '';
                appSettings.isLoggedIn = false;
                window.localStorage.setItem("userGroup", '');
                window.localStorage.setItem("userId", 0);
                window.localStorage.setItem("accessToken", '');
                window.localStorage.setItem("isLoggedIn", false);
                window.location.replace("index.html");
            }, 400);
            
            kendo.bind(e.view.element, activity, kendo.mobile.ui);
        };
        
        return {
          
            init: init,
            show: show,
      
            activity: function () {
                return activity;
            }
        };
    }());
    
    return activityViewModel;
}());