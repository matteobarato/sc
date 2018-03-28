var app = app || {};

        var emailToSrv = function() {
            var nome=$("input#emailName").val();
            var testo=$("input#emailMsg").val();
            if(testo=="")
                return;
                 debugger;
            $.ajax({
                url: appSettings.apiUrl + 'action=sendEmail',
                type: "POST",
                data: {
                'userid': appSettings.userId,
                'nome': nome,
                'testo': testo,
            },
               success: function (result) {
                   debugger;
                   app.showAlert("Il messaggio è stato inviato correttamente!", "Inviato!");
               }
           });                
           debugger;
        }; 

app.Support = (function () {
    'use strict';

    var Support = (function () {

          var shareEmail = function () {
              debugger;
              console.log("shareEmail");
          };
        return {
//            init: init,
            emailToSrv: emailToSrv,
            shareEmail: shareEmail
           
        };
    }());

    return Support;
}());