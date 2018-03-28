var app = app || {};

app.inviti = (function () {
    'use strict'
       
    var invitiViewModel = (function () {
        var activitiesDataSource = new kendo.data.DataSource();


        var invito = function(e) {


          debugger;
          var name=$("#name").val();
          if(name==""){
             $("input").addClass("error");
              alert("Inserisci il nome della persona che stai invitanto e un numero di telefono o un indirizzo email");
              return;
          }

          if($("#phone").val()==""&&$("#email").val()==""){
            $("input").addClass("error");
              alert("Inserisci un email o un numero di telefono per effettuare l'invito");
              return;
          }
          else{
            var phone=$("#phone").val();
            var email=$("#email").val();
            if(phone!=""){
              while(phone.includes(" "))
                phone=phone.replace(" ","");
              if(phone.substring(0,3)!="+39"){
                alert("Inserisci un numero di telefono con prefisso telefonico come segue: +393451234567");
                $("#phone").addClass("error");
                return;
              }
              if(phone.length<13){
                alert("Inserisci un numero di telefono con prefisso telefonico come segue: +393451234567");
                $("#phone").addClass("error");
                return;
              }
            }
            if(email!=""){
              while(email.includes(" "))
                email=email.replace(" ","");
              if(email.includes("@")==false){
                alert("Inserisci un email valida per effettuare l\'invito ");
                $("#email").addClass("error");
                return;
              }
              if(email.includes(".")==false){
                alert("Inserisci un email valida per effettuare l\'invito ");
                $("#email").addClass("error");
                return;
              }
            }
          }
            //?action=invito&userid=1&phone=%2B393450737164&email=&name=jack
          $.ajax({
              url: appSettings.apiUrl + 'action=invito',
              type: "POST",
              data: {
              'userid': appSettings.userId,
              'phone': phone,
              'email': email,
              'name':name
          },
              success: function (result) {
                debugger;
                 app.showAlert("Il messaggio di invito stato inviato correttamente!", "Grazie!");
                 $("input").removeClass("error");
             }
          });            
        };
        var init = function () {
        }
        
        var show = function (e) {

          $("#invito").click(function(){
              debugger;
          });

          $("input").val("");
          $("input").removeClass("error");
        }

        return {
            init: init,
            invito: invito,
            show: show
        };
    }());
    return invitiViewModel;
}());