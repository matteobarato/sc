/**
 * Card view model
 */

var app = app || {};
   
app.Card = (function () {
    'use strict'

    var userId = 0;
    // shops model
    var activitiesModel = (function() {

        var activitiesDataSource = new kendo.data.DataSource({
            serverPaging: true,
            pageSize: 1,
            transport: {
                read: {

                    url: function(options) {
                        
                        return appSettings.apiUrl + 'action=coupons&userid=' + appSettings.userId + '&usergroup=' + appSettings.userGroup + '';
                    },
                    dataType: "json",
                    data: {
                        q: "javascript"

                    }
                }
            },
            schema: {
                model: {

                    fields: {

                        Picture: {
                            field: 'image_url',
                            defaultValue: ''
                        },
                        Description: {
                            field: 'desc',
                            defaultValue: ''
                        },
                        Text: {
                            field: 'name',
                            defaultValue: ''
                        }



                    },
                    CouponCode: function() {
                        if (this.isbought == 0) {
                            return 'XXXXXX';
                        } else {
                            return this.coupon_code;
                        }
                    },
                    PictureUrl: function() {
                        if (this.Picture) {
                            return appSettings.projectUrl + this.Picture;
                        }
                        if (this.image_url) {
                            return appSettings.projectUrl + this.image_url;
                        }
                    },
                    sharedColor: function() {
                        if (this.isFree == 1) {

                            // this.shared = 1;
                        }

                        if (this.shared == 1 || this.shared == '1') {
                            return 'display:none;';
                        } else {
                            return 'display:block;';
                        }
                    },
                    itemIdentifier: function() {
                        return this.coupon_id === undefined ? 'n' + this.id : 'c' + this.coupon_id;
                    },
                    getCost: function() {
                        if(this.cost>0)
                            return this.cost+ " Punti";
                        else{
                            if(this.type=="Scapin Coupon")
                                return "Sconto";
                            else                        
                                return "News";
                        }
                    },
                    getTitle: function() {
                        debugger;
                        if(this.cost>0)
                            return "Premio";
                        if(this.type=="Scapin Coupon")
                            return "Coupon";
                        else
                            return "News";
                    }



                },
                data: "results"


            }
        });

        return {
            activities: activitiesDataSource
        };
    }());

    // Activities view model
    var activitiesViewModel = (function() {
        // Navigate to activityView When some activity is selected
        var activitySelected = function(e) {
            
            if(e.data.abled!="false")
                app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        };
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
        var init = function() {
            debugger;
        };

        var show = function() {
            debugger;
            if (window.localStorage.getItem('isShowAgain') == undefined) {
                setTimeout(function() {
                    navigator.notification.confirm('Condividi i coupon e le novità di Scapin sul tuo profilo Facebook e vinci ogni mese fantastici premi! Per maggiori informazioni leggi la sezione "Come funziona?', function(confirmed) {
                        var exit = function() {
                            navigator.app.exitApp();
                        };
                        if (confirmed === true || confirmed === 1) {
                            window.localStorage.setItem("isShowAgain", "No");
                            //  exit();
                        }
                    }, 'Attenzione', ['non mostrare più', 'Ok']);
                }, 1000);
            }
            $('#tabcard > span.km-icon').remove();
            if ($('#tabcard > .ion-card').length < 1)
                $('#tabcard').prepend('<span class="ion-card" style="font-size:30px"></span>');
            $('#tabcoupon > span.km-icon').remove();

            if ($('#tabcoupon > .fa-ticket').length < 1)
                $('#tabcoupon').prepend('<i class="fa fa-ticket" style="font-size:30px"></i>');
            setTimeout(function() {
                $('' + sharedDashboard + '').hide();
                sharedDashboard = '';
            }, 1000);
                    };
        var shareActivity = function(e) {
            
            var pictureUrl = e.data.PictureUrl();
            var referalImage = e.data.referalImage;
            if (referalImage != undefined && referalImage.length > 0) {
                pictureUrl = referalImage;
            }
            var link = e.data.referalLink;

            if (link == undefined || link.length < 1) {
                link = 'www.scapin1935.it';
            }
            var Description = e.data.Description;
            var title = e.data.Text;
            var points = e.data.social_points;
            var type = e.data.type;
            var id = e.data.coupon_id != undefined ? e.data.coupon_id : e.data.id;

            var idtoMove = e.data.uid;
            
            shared = e.data.shared
            if (e.data.isFree == 1) {
                //shared = 1;
            }
            var currentUid = e.data.uid;
            if (shared == 1) {
                if (triesForShare > 3) {
                    app.showErrorWithTitle('La notizia o cedola già condivise non possono essere condivise di nuovo.', 'Attenzione!');
                } else {
                    triesForShare++;
                }
            } else {

                app.mobileApp.showLoading();
                facebookConnectPlugin.getLoginStatus(function(loginstatus) {
                    if (loginstatus.status === 'connected') {
                        
                        share(pictureUrl, Description, points, id, type, idtoMove, loginstatus.authResponse.accessToken, title, link);
                        shared = 1;
                        
                        app.shops.activities.getByUid(currentUid).shared = 1;
                        app.shops.activities.getByUid(currentUid).CouponCode = function() {
                            
                            return app.Activities.activities.getByUid(currentUid).coupon_code;
                        };
                        $(e.sender.element).hide();
                    } else {
                        facebookConnectPlugin.login(["public_profile,email,publish_actions,user_photos"],
                            function(response) {
                                if (response.status === 'connected') {
                                    

                                    share(pictureUrl, Description, points, id, type, idtoMove, response.authResponse.accessToken, title, link);
                                    
                                    app.shops.activities.getByUid(currentUid).shared = 1;
                                    app.shops.activities.getByUid(currentUid).CouponCode = function() {
                                        
                                        return app.Shops.activities.getByUid(currentUid).coupon_code;
                                    };
                                    $(e.sender.element).hide();
                                } else {
                                    app.mobileApp.hideLoading();
                                    app.showErrorWithTitle('Errore: Si prega di effettuare il login con il proprio profilo di Facebook per condividere ed ottenere Punti Social', 'Attenzione!');
                                }
                            },
                            function(error) {
                                app.mobileApp.hideLoading();
                            });
                    }
                }, function(error) {
                    app.mobileApp.hideLoading();
                });
            }
        };
        // Navigate to app home

        var navigateHome = function() {
            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function() {};

        return {
            show: show,
            init: init,
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            emailToSrv: emailToSrv,
            shareActivity: shareActivity,
            logout: logout
        };
    }());

    return activitiesViewModel;
}());