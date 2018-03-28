/**
 * Activities view model
 */

var app = app || {};

app.SocialSpecifica = (function () {
    'use strict'

    var userId = 0;
    // Activities model
    var socialsModel = (function () {
        var socialsDataSource = new kendo.data.DataSource({
                                                                    
                                                              transport: {
                read: {
                                                                          url:function(options) {
                                                                              return appSettings.apiUrl + 'action=socialSpecific&usergroup=' + appSettings.userGroup + '';
                                                                          }
                                                                          ,   
                                                                          dataType: "json",
                                                                          data: {
                                q: "javascript"
                                                                                 
                            }
                                                                      }
            },schema: {
                model: {
                        imageurl:function() {
                            if (this.image_url.indexOf("http") > -1) {
                                return this.image_url;
                            } else if(this.image_url.length > 0) {
                                return appSettings.projectUrl + this.image_url;
                            }else{
                                return 'styles/images/scapin-logo.png';
                            }
                        },
                        
                    },
                data: "results" 
             
            
            }
                                                          });
        
        return {
            notications: socialsDataSource
        };
    }());

    // Activities view model
    var activitiesViewModel = (function () {
        // Navigate to activityView When some activity is selected
        var init = function() {
            //
            $.ajax({
                       url: appSettings.apiUrl + 'action=CurrentMonth',
                       type:"POST",
                       data:{},
                       success:function(result) {
                           console.log('Shared post ' + result);
                                      
                           if (result !== undefined && result.length > 0) {
                               $('#socialMonth').text(result);
                           } else {
                               var d = new Date();
                               var n = d.getMonth();
                               switch (n) {
                                   case 1:
                                       n = 'Gennaio';
                                       break;
                                   case 2:
                                       n = 'Febbraio';
                                       break;
                                   case 3:

                                       n = 'Marzo';
                                       break;
                                   case 4:
                                       n = 'Aprile';
                                       break;
                                   case 5:
                                       n = 'Maggio';
                                       break;
                                   case 6:
                                       n = 'Giugno';
                                       break;
                                   case 7:
                                       n = 'Luglio';
                                       break;
                                   case 8:
                                       n = 'Agosto';
                                       break;
                                   case 9:
                                       n = 'Settembre';
                                       break;
                                   case 10:
                                       n = 'Ottobre';
                                       break;
                                   case 11:
                                       n = 'Novembre';
                                       break;
                                   case 12:
                                       n = 'Dicembre';
                                       break;
                               } 
                              $('#socialMonth').text(n);
                           }
                       },error:function() {
                       }
                   });
        };
        var show = function() {
            //$("#social-listview").kendoListView({
            //                                        dataSource: socialsModel.notications,
            //                                        template: kendo.template($("#socialTemplate").html()),
            //                                        pullToRefresh: true,
            //                                        appendOnRefresh: true,
            //                                    });
        };

        // Logout user
        var logout = function () {
        };
       
        return {
            show:show,
            init:init,
            activities: socialsModel.notications,
           
            logout: logout
        };
    }());
    
    return activitiesViewModel;
}());