/**
 * AddActivity view model
 */

var app = app || {};

app.AddActivity = (function () {
    'use strict'

    var addActivityViewModel = (function () {
        
        var $newStatus;
        var validator;
        
        var init = function () {
            
            validator = $('.enterStatus').kendoValidator().data('mobileValidator');
            $newStatus = $('.newStatus');

            $newStatus.on('keydown', app.helper.autoSizeTextarea);
        };
        
        var show = function () {
            
            // Clear field on view show
            $newStatus.val('');
            validator.hideMessages();
           
        
        var saveActivity = function () {
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new activity to Activities model
                var activities = app.Activities.activities;
               
                activity.UserId = app.Users.currentUser.post('data').Id;
                
                activities.one('syc', function () {
                   
                });
                
                activities.syc();
            }
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveActivity: show
        };
        
    }();
    
    return addActivityViewModel;
    
}())});
