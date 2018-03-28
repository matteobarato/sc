/**
 * profile view model
 */

var app = app || {};

app.Contact = (function () {
    'use strict'
       
    var activityViewModel = (function () {
        var $activityPicturediv, dataSource, $picture, $displayName, $socialPoints, $totalPoints;
        
        var init = function () {
            $('#userid').val(appSettings.userId);
        };
        
        var show = function (e) {
        };
        var send = function() {
            app.mobileApp.showLoading();
            var data = $('#contactform').serialize();
           
            $.ajax({
                       url: appSettings.apiUrl + 'action=message&',
                       type:"POST",
                       data:data,
                       success:function(result) {

                           result = JSON.parse(result);
                           app.mobileApp.hideLoading();
                           if (result.success === true) {
                               
                               app.mobileApp.navigate('views/activitiesView.html');
                               app.showErrorWithTitle('Messaggio inviato con successo', 'Complimenti!');
                               
                           }else {
                               app.showErrorWithTitle('Some error happened', 'Attenzione!');
                           }
                       },error:function(err) {

                           app.mobileApp.hideLoading();
                           app.showErrorWithTitle('Some error happened', 'Attenzione!');
                       }
                   }
                );
        };
        return {
            init: init,
            show: show,
            send:send
           
        };
    }());
    
    return activityViewModel;
}());