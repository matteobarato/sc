/**
 * Signup view model
 */

function onSignUpPhotoDataSuccess(imageData) {
    var smallImage = document.getElementById('largeImage');
    var imageHiddenValue = document.getElementById('imageValue');

    smallImage.style.display = 'block';
    smallImage.src = "data:image/png;base64," + imageData;
    imageHiddenValue.value = imageData;
}
function checkLength(id, length, listnumber, message) {
    if ($('#' + id).val().length < length) {
        $('#signup-form > li:nth-child(' + listnumber + ') > span').show().text(message);
        return false;
    }else {
        $('#signup-form > li:nth-child(' + listnumber + ') > span').hide();
        return true;
    }
}
function validateEmail(id, length, listnumber, message) {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if ($('#' + id).val().match(pattern)) {
        $('#signup-form > li:nth-child(' + listnumber + ') > span').hide();
        return true;
    }else {
        $('#signup-form > li:nth-child(' + listnumber + ') > span').show().text(message);
        return false;
    }
}

function isFormValid() {
    var namevalid = checkLength('signupName', 1, 1, 'Il nome è obbligatorio');
    var emailengthlvalid = checkLength('signupEmail', 1, 2, 'È richiesto Email.');
    var emailvalid = validateEmail('signupEmail', 1, 2, "L'email non è valida");
    var usernamevalid = checkLength('signupUsername', 5, 3, 'nome utente deve essere di 6 caratteri o più.');
    var passwordvalid = checkLength('signupPassword', 5, 4, 'password deve essere di 6 caratteri o più.');
    return (namevalid && emailengthlvalid && emailvalid && usernamevalid && passwordvalid);
}

var app = app || {};

app.Signup = (function () {
    'use strict';

    var singupViewModel = (function () {
        var dataSource;
        var $signUpForm;
        var $formFields;
        var $signupInfo;
        var $signupBtnWrp;
        var validator;

        // Register user after required fields (username and password) are validated in Backend Services
        var signup = function () {
            //action=validateRegister
            debugger;
            //if (document.getElementById('imageValue').value.length < 1) {
            //    app.showErrorWithTitle('Si prega di scattare una foto.', 'Attenzione!');
            //}else 
            if (isFormValid()) {
                app.mobileApp.showLoading();
                var formdata = $('#signUp').serialize();
                $.ajax({
                           url: appSettings.apiUrl + 'action=validateRegister',
                           type:"POST",
                           data:formdata,
                           success:function(data) {
                               data = JSON.parse(data);
                               debugger;
                               if (data.results.shortusername == false && data.results.emailexists == false && data.results.userexists == false) {
                                   $.ajax({
                                              url: appSettings.apiUrl + 'action=register',
                                              type:"POST",
                                       contenttype:'jsonp',
                                              data:formdata,
                                              success:function(data) {
                                                  data = JSON.parse(data);
                                                  if (data.access_token) {
                                                      //app.mobileApp.hideLoading();
                                                      app.showErrorWithTitle('Sei registrato con successo.', 'Complimenti!');
                                                     window.location.replace("index.html");
                                                      
                                                  } else {
                                                      app.mobileApp.hideLoading();
                                                      app.showErrorWithTitle('Si è verificato un errore. Riprovare.', 'Avviso');
                                                  }
                                              }
                                              ,error:function(err) {
                                                 
                                                  app.mobileApp.hideLoading();
                                                  app.showErrorWithTitle('Si è verificato un errore. Riprovare.', 'Avviso');
                                              }
                                          });
                               }else {
                                   app.mobileApp.hideLoading();
                                   if (data.results.emailexists == true) {
                                       //email
                                       $('#signup-form > li:nth-child(2) > span').show().text('e-mail già registrato.');
                                   }
                                   if (data.results.shortusername == true) {
                                       //username
                                       $('#signup-form > li:nth-child(3) > span').show().text('nome utente deve essere di 6 caratteri o più.');
                                   }
                                   if (data.results.userexists == true) {
                                       //username
                                       $('#signup-form > li:nth-child(3) > span').show().text('nome utente esiste già.');
                                   }
                               }
                           }
                           ,error:function(err) {
                               debugger;
                               app.mobileApp.hideLoading();
                               app.showErrorWithTitle('Si è verificato un errore. Riprovare.', 'Avviso');
                           }
                       });
            } else {
                $('#signupName,#signupEmail,#signupUsername,#signupPassword').on('change', function() {
                    isFormValid();
                });
            }
        };

        // Executed after Signup view initialization
        // init form validator
        var init = function () {
            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupInfo = $('#signupInfo');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });

            $signupInfo.on('keydown', app.helper.autoSizeTextarea);
        }

        // Executed after show of the Signup view
        var show = function () {
            $signupInfo.prop('rows', 1);
            $('#signupName,#signupEmail,#signupUsername,#signupPassword,#signupBirthDatePicker,#signupInfo,#imageValue').val('');
            $('#largeImage').attr('src','').hide();
            dataSource = kendo.observable({
                                              Username: '',
                                              Password: '',
                                              DisplayName: '',
                                              Email: '',
                                              Gender: '0',
                                              About: '',
                                              Friends: [],
                                              BirthDate: new Date()
                                          });
        };
        var capturePhotoWithData = function capturePhotoWithData() {
            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(onSignUpPhotoDataSuccess, onFail, { quality: 50 ,destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true, targetWidth: 1364, targetHeight: 1364 });
        }

        var capturePhotoWithFile = function capturePhotoWithFile() {
            navigator.camera.getPicture(onSignUpPhotoDataSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM });
        }

        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            $signupBtnWrp.addClass('disabled');
        };

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected === 0) ? '#b6c5c6' : '#34495e';
        }

        return {
            init: init,
            show: show,
            hide: hide,
            capturePhotoWithFile : capturePhotoWithFile,
            capturePhotoWithData:capturePhotoWithData,
            onSelectChange: onSelectChange,
            signup: signup
        };
    }());

    return singupViewModel;
}());