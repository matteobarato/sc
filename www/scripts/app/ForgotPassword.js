/**
 * Activity view model
 */

var app = app || {};

app.forgotPassword = (function () {
    'use strict'
    
    var activityViewModel = (function () {
        var activityUid,
            activity,
            $activityPicture;
     
        var init = function () {
            // window.history.forward();
            // 
        };
        
        var show = function (e) {
            $('#requestPasswordReset').click(function(e) {
                var email = $('#passwordResetEmail').val();
                if (email.length > 0) {
                    app.mobileApp.showLoading();
                    $.ajax({
                               url: appSettings.apiUrl + 'action=ForGotPassword',
                               type:"GET",
                               data:{'email':email},
                               success:function(result) {
                                   debugger;
                                   app.mobileApp.hideLoading();
                                   result = JSON.parse(result);
                                   if (result.success) {
                                       app.showErrorWithTitle('La tua nuova password è stata inviata con successo al tuo indirizzo email.', 'Successo!!');
                                   }else {
                                       app.showErrorWithTitle(result.message, 'Attenzione!');  
                                   }
                               },error:function() {
                                   app.showErrorWithTitle('Errore di connessione, riprova più tardi.', 'Attenzione!');  
                               }
                           });
                }else {
                    debugger;
                    app.mobileApp.hideLoading();
                    app.showErrorWithTitle('Inserire il proprio indirizzo email per la reimpostazione della password.', 'Attenzione!');  
                }
            });
        };
        var forgotPasword = function(e) {
        }
        return {
          
            init: init,
            show: show,
            resetPassword: forgotPasword,      
            activity: function () {
                return activity;
            }
        };
    }());
    
    return activityViewModel;
}());