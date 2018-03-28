/**
 * profile view model
 */
function pushToggled(e) {
    app.mobileApp.showLoading();
    var isChecked = e.checked===true?1:0;
    $.ajax({
               url: appSettings.apiUrl + 'action=togglePush&userid=' + appSettings.userId,
               type:"POST",
               data:{state : isChecked},
               success:function(result) {
                   app.mobileApp.hideLoading();      
                   window.localStorage.setItem("pushEnabled", e.checked);
               },error:function(e) {
                   app.mobileApp.hideLoading();
               }
           });
};
function openPrivacy() {
    app.mobileApp.navigate('views/privacy.html');
}

var app = app || {};

app.SettingsView = (function () {
    'use strict'
       
    var activityViewModel = (function () {
        var $activityPicturediv, dataSource, $picture, $displayName, $socialPoints, $totalPoints;
        
        var init = function () {
        };
        
        var show = function (e) {
            debugger;
            var state = window.localStorage.getItem('pushEnabled');
            var checked = (state == 'false') ? false : true;
         
            var switchInstance = $("#pushEnabled").data("kendoMobileSwitch");
            switchInstance.check(checked);
            $.ajax({
                       url: appSettings.apiUrl + 'action=userprofile&userid=' + appSettings.userId,
                       type:"POST",
                       data:{},
                       success:function(result) {
                            result = JSON.parse(result);
                           debugger;
                            var state = result.result.pushEnabled;
                            var checked = state === "1"? true:false;
                           var switchInstance = $("#pushEnabled").data("kendoMobileSwitch");
                           switchInstance.check(checked);
                            window.localStorage.setItem("pushEnabled", checked);
                           
                       },
                       error:function(e) {
                       }
                   }); 
        };
        
        return {
            pushToggled:pushToggled,
            init: init,
            show: show,
           
        };
    }());
    
    return activityViewModel;
}());