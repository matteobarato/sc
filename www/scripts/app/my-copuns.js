/**
 * Card view model
 */
function initializeMyCoupons() {
}

var app = app || {};

app.Copuns = (function () {
    'use strict'
       
    var CouponViewModel = (function () {
        var $activityPicturediv, dataSource, $picture, $displayName, activities, $socialPoints, $totalPoints;
        var activitiesDataSource = new kendo.data.DataSource({
                                                                 transport: {
                read: {
                                                                             url:function(options) {
                                                                                 return appSettings.apiUrl + 'action=mycoupons&userid=' + appSettings.userId ;
                                                                             },
                                                                             dataType: "json",
                                                                             data: {
                                q: "javascript"
                            }
                                                                         }
            },schema: {
                model: {
                       
                        fields: {
               
                                Picture: {
                                            field: 'image_url',
                                            defaultValue: ''
                                        },
                                Description:{
                                            field: 'desc',
                                            defaultValue: ''
                                        }
                                ,
                                Text:{
                                            field: 'name',
                                            defaultValue: ''
                                        }
                            
                            
                            
                            },
                        CouponCode:function() {
                            if (this.isbought == 0) {
                                return 'XXXXXX';
                            }else {
                                return this.coupon_code;
                            }
                        },
                        startdate: function() {
                            var d = this.start_date.split(/[ ]/)[0].split('-');
                            var o = d[2]+'-'+d[1]+'-'+d[0];
                            return o;
                          
                            
                        },
                        enddate: function() {
                            var d = this.end_date.split(/[ ]/)[0].split('-');
                            var o = d[2]+'-'+d[1]+'-'+d[0];
                            return o;
                          
                        },
                        PictureUrl: function() {
                            if (this.Picture) {
                                return 'http://hellocreativestudio.it/scapin/' + this.Picture;
                            }
                            if (this.image_url) {
                                return 'http://hellocreativestudio.it/scapin/' + this.image_url;
                            }
                        },sharedColor :function(){
                                return 'opacity:0.5;';
                        },
                    itemIdentifier : function(){
                             return this.coupon_id;
                    }
                    },
                data: "results" 
             
            
            }
                                                             });
    
        $("#copunsactivities-listview").kendoMobileListView({
                                                                dataSource: activitiesDataSource,
                                                                pullToRefresh: true,
                                                                appendOnRefresh: true,
                                                                template: $("#copuns-activityTemplate").text(),
            pullTemplate: "<i>Pull to update the number</i>",
                releaseTemplate: "Release to update the number",
                refreshTemplate: "Updating..."
            
            
                                                            });
        var init = function () {
            initializeMyCoupons();
            dataSource = kendo.observable({
                                              UserPictureUrl: '',
                                              DisplayName: '',
                                              CreatedAtFormatted: '',
                                              SocialPoints:0,
                                              TotalPoints:0,
                                          });
              app.mobileApp.showLoading();
            $.ajax({
                       url: appSettings.apiUrl + 'action=userprofile&userid=' + appSettings.userId,
                       type:"POST",
                       data:{},
                       success:function(result) {
                             app.mobileApp.hideLoading();
                           result = JSON.parse(result);
                           $activityPicturediv = $('#copuns-view #picture-user-container');
                           $picture = $('#copuns-view #picture-user');
                           $displayName = $('#copuns-view #UserDisplayName');
                           $socialPoints = $('#copuns-view #socialPoints');
                           $totalPoints = $('#copuns-view #totalPoints');
                          if (result.result.image_url.indexOf("http") < 0 && result.result.image_url.length> 0) {
                               dataSource.UserPictureUrl = appSettings.projectUrl + result.result.image_url;
                                $picture.attr('src', dataSource.UserPictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.UserPictureUrl + ')');
                           } else if(result.result.image_url.length> 0){
                               dataSource.UserPictureUrl = result.result.image_url;
                                $picture.attr('src', dataSource.UserPictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.UserPictureUrl + ')');
                           }else{
                                   dataSource.PictureUrl = 'styles/images/scapin-logo.png';
                                $picture.attr('src', dataSource.PictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.PictureUrl + ')');
                           }
                           
                          
                           dataSource.DisplayName = result.result.name;
                           $displayName.text(result.result.name);
                           dataSource.CreatedAtFormatted = 'September 18';
                          
                           $socialPoints.html(dataSource.SocialPoints);
                           if (result.result.socialPoints != undefined) {
                               dataSource.SocialPoints = result.result.socialPoints;
                               $socialPoints.html(dataSource.SocialPoints);
                           }
                           $totalPoints.html(dataSource.TotalPoints);
                           if (result.result.totalPoints != undefined) {
                               dataSource.TotalPoints = result.result.totalPoints; 
                               $totalPoints.html(dataSource.TotalPoints);
                           }
                       }
                   });
        }
        
        var show = function (e) {
            // Get current activity (based on item uid) from Activities model
            //kendo.bind('#copuns-view', dataSource, kendo.mobile.ui);
            $.ajax({
                       url: appSettings.apiUrl + 'action=userprofile&userid=' + appSettings.userId,
                       type:"POST",
                       data:{},
                       success:function(result) {
                           result = JSON.parse(result);
                           $activityPicturediv = $('#copuns-view #picture-user-container');
                           $picture = $('#copuns-view #picture-user');
                           $displayName = $('#copuns-view #UserDisplayName');
                           $socialPoints = $('#copuns-view #socialPoints');
                           
                           $totalPoints = $('#copuns-view #totalPoints');
                           if (result.result.image_url.indexOf("http") < 0 && result.result.image_url.length> 0) {
                               dataSource.UserPictureUrl = appSettings.projectUrl + result.result.image_url;
                               
                           } else if(result.result.image_url.length> 0){
                               dataSource.UserPictureUrl = result.result.image_url;
                               
                           }else{
                                   dataSource.UserPictureUrl = 'styles/images/scapin-logo.png';
                                $picture.attr('src', dataSource.UserPictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.PictureUrl + ')');
                           }
                           if(dataSource.UserPictureUrl !== $picture.attr('src'))
                           {
                                  $picture.attr('src', dataSource.UserPictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.UserPictureUrl + ')');
                           }
                           
                           
                           $socialPoints.html(dataSource.SocialPoints);
                            $displayName.text(result.result.name);
                           if (result.result.social_points != undefined) {
                               dataSource.SocialPoints = result.result.social_points;
                               $socialPoints.html(dataSource.SocialPoints);
                           }
                           $totalPoints.html(dataSource.TotalPoints);
                           if (result.result.total_points != undefined) {
                               dataSource.TotalPoints = result.result.total_points; 
                               $totalPoints.html(dataSource.TotalPoints);
                           }
                       }
                   });
        }

        var activitySelectedsingle = function activitySelectedsingle(e) {

            app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        }
        return {
            init: init,
            show: show,
            activities:activitiesDataSource,
            activitySelectedsingle : activitySelectedsingle,
           
            dataSource: function () {
                return dataSource;
            }
        };
    }());
    
    return CouponViewModel;
}());