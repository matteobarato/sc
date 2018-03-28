/**
 * Activity view model
 */

    var showAlert = function (message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };
var userId;
var id;
var type;    
var title ="asd";    
var codestring="";
function updateSocialPoints(userId,points,id,type){
}

function richiediSconto(code){
	$.ajax({
        url: appSettings.apiUrl + 'action=richiediSconto',
        type:"POST",
        data:{ code:codestring},
        success:function(result) {
            debugger;
            alert("La tua richiesta di sconto è stata inviata");
        //   result = JSON.parse(result);
            app.mobileApp.hideLoading();
	},error : function(error) {
	    app.mobileApp.hideLoading();
	}
	});  
}

function handleEvent(e) {
	window.location.reload(true);
}

function calculateCode(activity) {
    debugger;
	return activity.code;
}

var app = app || {};

app.Activity = (function () {
    'use strict'

    var current ;
    var $commentsContainer,
        listScroller;
    
    var activityViewModel = (function () {
        var activityUid,
            activity,
            $activityPicture;
        var shareActivitySingle = function(e) {
            showalert('shared');
        };

        var init = function () {
            $commentsContainer = $('#comments-listview');
            $activityPicture = $('#picture');
            $('#singleShare').click(function(e) {
                return;
            });
        };

        function refill(string,lenght,token){
            var response="";
            for(var i=0;i<lenght-string.length;i++)
            response+=token;
            return response+string;
        }

        var show = function (e) {
            $commentsContainer.empty();
            listScroller = e.view.scroller;
            listScroller.reset();
            activityUid = e.view.params.uid;
            current = activityUid;

            // Get current activity (based on item uid) from Activities model
            activity = app.Activities.activities.getByUid(activityUid);

            // 1
            // nome locale
            // #newsdetails .topheader-time.mockupTitle

            // 2
            // img locale
            // #newsdetails .image_conteiner

            // 3
            // descrizione locale
            // #newsdetails .copunText2


            // 4
            // descrizione2 locale
            // #newsdetails .copunDescription.mockuptext ??
            debugger;

            var shopname=activity.shop_name;
            var newsimage=activity.negozio;
            var title=activity.Text;
            var desc=activity.Description;
            $("#newsdetails .topheader-time.mockupTitle").text(shopname);
            $("#newsdetails .image_conteiner").css("background","url('"+newsimage+"')");
            $("#newsdetails .copunText3").text(title);
            $("#newsdetails .copunDescription.mockuptext").text(desc);

            var currentActivity = activity ;
            var link = currentActivity.referalLink;

            $('#backButton').attr('href', 'views/activitiesView.html');

            if (activity === undefined) {
                activity = app.Copuns.activities.getByUid(activityUid);
                $('#backButton').attr('href', 'views/myCopuns.html');
            }

            app.Comments.comments.filter({
                field: 'ActivityId',
                operator: 'eq',
                value: activity.Id
            });
            
            kendo.bind(e.view.element, activity, kendo.mobile.ui);
        };
        
        var removeActivity = function () {
            var activities = app.Activities.activities;
            var activity = activities.getByUid(activityUid);
            
            app.showConfirm(
                appSettings.messages.removeActivityConfirm,
                'Delete Activity',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        activities.remove(activity);
                        activities.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        activities.sync();
                    }
                }
                );
        };
        
        return {
            shareActivitySingle : shareActivitySingle,
            init: init,
            show: show,
            remove: removeActivity,
           
            activity: function () {
                return activity;
            }
        };
    }());
    
    return activityViewModel;
}());