/**
 * profile view model
 */

var app = app || {};

app.Profile = (function () {
    'use strict'
       
    var activityViewModel = (function () {
        var $activityPicturediv, dataSource, $picture, $displayName, $socialPoints, $totalPoints;
        
        var init = function () {
                 debugger;
            dataSource = kendo.observable({
                                              PictureUrl: '',
                                              DisplayName: '',
                                              CreatedAtFormatted: '',
                                              Email :'',
                                              dob:'',
                                              gender:'',
                                              About:'',
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
                           $activityPicturediv = $('#profile-view #picture-user-container');
                           $picture = $('#profile-view #picture-user');
                           $displayName = $('#profile-view #UserDisplayName');
                           $socialPoints = $('#profile-view #socialPoints');
                           $totalPoints = $('#profile-view #totalPoints');
                           
                          if (result.result.image_url.indexOf("http") < 0 && result.result.image_url.length> 0) {
                               dataSource.PictureUrl = appSettings.projectUrl + result.result.image_url;
                                $picture.attr('src', dataSource.PictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.PictureUrl + ')');
                           } else if(result.result.image_url.length> 0){
                               dataSource.PictureUrl = result.result.image_url;
                                $picture.attr('src', dataSource.PictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.PictureUrl + ')');
                           }else{
                                   dataSource.PictureUrl = 'styles/images/scapin-logo.png';
                                $picture.attr('src', dataSource.PictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.PictureUrl + ')');
                           }
                           
                           /*dataSource.PictureUrl = result.result.picture;*/
                           
                           dataSource.DisplayName = result.result.name;
                           $displayName.text(result.result.name);
                           dataSource.CreatedAtFormatted = 'September 18';
                           dataSource.Email = result.result.email;
                          
                           var date = new Date(result.result.dob);
                           var monthNames = [
                               "01", "02", "03",
                               "04", "05", "06", "07",
                               "08", "09", "10",
                               "10", "12"
                           ];
                           var day = date.getDate();
                           var monthIndex = date.getMonth();
                           var year = date.getFullYear();
                           dataSource.dob = day + '-' + monthNames[ monthIndex] + '-' +  + year;
                           dataSource.gender = result.result.gender;
                           dataSource.About = result.result.desc;
           
                           if (result.result.social_points != undefined) {
                               dataSource.SocialPoints = result.result.social_points; 
                           }
                           if (result.result.total_points != undefined) {
                               dataSource.TotalPoints = result.result.total_points; 
                           }
                           
                           kendo.bind('#profile-view', dataSource, kendo.mobile.ui);
                           dataSource.bind("change", function (e) {
                               kendoConsole.log(e.field + " = " + this.get(e.field));
                           });
                       },error:function(err) {
                           app.mobileApp.hideLoading();
                       }
                   });
        };
        var editProfile = function() {
        };
        var show = function (e) {
            debugger;
            // Get current activity (based on item uid) from Activities model
            $.ajax({
                       url: appSettings.apiUrl + 'action=userprofile&userid=' + appSettings.userId,
                       type:"POST",
                       data:{},
                       success:function(result) {
                           result = JSON.parse(result);
                           $('[data-bind="text: Email"]').text(result.result.email);
                           $('[data-bind="text: dob"]').text(result.result.dob);
                           $('[data-bind="text: gender"]').text(result.result.gender);

/*                           $activityPicturediv = $('#profile-view #picture-user-container');
                           $picture = $('#profile-view #picture-user');
                           $displayName = $('#profile-view #UserDisplayName');
                           $socialPoints = $('#profile-view #socialPoints');
                           $totalPoints = $('#profile-view #totalPoints');
             
                           if (result.result.image_url.indexOf("http") < 0 && result.result.image_url.length> 0) {
                               dataSource.PictureUrl = appSettings.projectUrl + result.result.image_url;
                               
                           } else if(result.result.image_url.length> 0){
                               dataSource.PictureUrl = result.result.image_url;
                               
                           }else{
                                dataSource.PictureUrl = 'styles/images/scapin-logo.png';
                                $picture.attr('src', dataSource.PictureUrl);
                                $activityPicturediv.css('background-image', 'url(' + dataSource.PictureUrl + ')');
                           }
                           if (dataSource.PictureUrl !== $picture.attr('src')) {
                               $picture.attr('src', dataSource.PictureUrl);
                               $activityPicturediv.css('background-image', 'url(' + dataSource.PictureUrl + ')');
                           }
                           dataSource.DisplayName = result.result.name;
                           $displayName.text(result.result.name);
                            var date = new Date(result.result.dob);
                           var monthNames = [
                               "01", "02", "03",
                               "04", "05", "06", "07",
                               "08", "09", "10",
                               "10", "12"
                           ];
                           var day = date.getDate();
                           var monthIndex = date.getMonth();
                           var year = date.getFullYear();
                           dataSource.dob = day + '-' + monthNames[ monthIndex] + '-' +  + year;
                           dataSource.gender = result.result.gender;
                           dataSource.About = result.result.desc;
                           if (result.result.social_points != undefined) {
                               dataSource.SocialPoints = result.result.social_points; 
                           }
                           if (result.result.total_oints != undefined) {
                               dataSource.TotalPoints = result.result.total_oints; 
                           }
                           */
                           kendo.bind('#profile-view', dataSource, kendo.mobile.ui);
                           dataSource.bind("change", function (e) {
                               kendoConsole.log(e.field + " = " + this.get(e.field));
                           });
                       },error:function(err) {
                       }
                   });
        };
        
        return {
            init: init,
            show: show,
            editProfile:editProfile,
            remove: null,
            dataSource: function () {
                return dataSource;
            }
        };
    }());
    
    return activityViewModel;
}());