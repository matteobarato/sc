/**
 * Card view model
 */

var app = app || {};
   
app.shop = (function () {
    'use strict'

    // Activities view model
    var activitiesViewModel = (function() {
        var init = function() {debugger;};
        var show = function() {
            debugger;
            var uid=0;
            debugger;
            $.get(appSettings.apiUrl + 'action=getshop&uid=' + uid,function(response){
                var shops=JSON.parse(response);
           })
        };

        // Navigate to app home
        var navigateHome = function() {
            app.mobileApp.navigate('#welcome');
        };


        return {
            show: show
        };
    }());

    return activitiesViewModel;
}());