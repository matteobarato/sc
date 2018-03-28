/**
 * Card view model
 */

var app = app || {};
   
app.Lists = (function () {
    'use strict'
       
    var activityViewModel = (function () {
        var $activityPicturediv, dataSource, $picture, $displayName, $socialPoints, $totalPoints;
        
        var init = function () {
           
            initFunction();
            dataSource = kendo.observable({
                                              PictureUrl: '',
                                              DisplayName: 'ali',
                                              CreatedAtFormatted: '',
                                              barcode:'Cheese',
                                              SocialPoints:0,
                                              TotalPoints:0,
                                          });

        };
        
        var show = function (e) {
            // Get current activity (based on item uid) from Activities model
          
            
            kendo.bind('#card-view', dataSource, kendo.mobile.ui);
        };
        
        return {
            init: init,
            show: show,
            remove: null,
            dataSource: function () {
                return dataSource;
            }
        };
    }());
    
    return activityViewModel;
}());
function initFunction() {
    var dataSource = new kendo.data.DataSource({
                                                   transport: {
            read: {
                                                               url: "http://hellocreativestudio.net/scontoClub/api.php?action=copuns",
                                                               dataType: "json",
                                                               data: {
                            q: "javascript"
                        }
                                                           }
        },schema: {
            data: "results" 
        }
                                               });
    
    $("#lists-listview").kendoListView({
                                     dataSource: dataSource,
                                     template: $("#activityTemplate").text(),
                                     autoBind: true,
         pullToRefresh: true,
    appendOnRefresh: true,
        
                                 });
}