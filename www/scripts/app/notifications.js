/**
 * Activities view model
 */

var app = app || {};

app.Notifications = (function () {
    'use strict'

    var userId = 0;
    // Activities model
    var notificationsModel = (function () {
        // var activityModel = {
        //    id: 'Id',
        //    fields: {
        //        Text: {
        //                field: 'Text',
        //                defaultValue: ''
        //            },
        //        CreatedAt: {
        //                field: 'CreatedAt',
        //                defaultValue: new Date()
        //            },
        //        Picture: {
        //                fields: 'Picture',
        //                defaultValue: null
        //            },
        //        UserId: {
        //                field: 'UserId',
        //                defaultValue: null
        //            },
        //        Likes: {
        //                field: 'Likes',
        //                defaultValue: []
        //            },
        //        Points :{
        //                field:'Points',
        //                defaultValue: ''
        //            }
        //    },
        //    CreatedAtFormatted: function () {
        //        return app.helper.formatDate(this.get('CreatedAt'));
        //    },
        //    PictureUrl: function () {
        //        return app.helper.resolvePictureUrl(this.get('Picture'));
        //    },
        //    User: function () {
        //        var userId = this.get('UserId');
        //        var user = $.grep(app.Users.users(), function (e) {
        //            return e.Id === userId;
        //        })[0];
        //        return user ? {
        //            DisplayName: user.DisplayName,
        //            PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
        //        } : {
        //            DisplayName: 'Anonymous',
        //            PictureUrl: app.helper.resolveProfilePictureUrl()
        //        };
        //    },
        //    isVisible: function () {
        //        var currentUserId = app.Users.currentUser.data.Id;
        //        var userId = this.get('UserId');
        //        var u = user.DisplayName
        //        return currentUserId === userId;
        //    }
        //};
        //Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        //var activitiesDataSource = new kendo.data.DataSource({
        //                                                         type: 'everlive',
        //                                                         schema: {
        //        model: activityModel
        //    },
        //                                                         transport: {
        //        // Required by Backend Services
        //        typeName: 'Activities'
        //    },
        //                                                         change: function (e) {
        //                                                             if (e.items && e.items.length > 0) {
        //                                                                 $('#no-activities-span').hide();
        //                                                             } else {
        //                                                                 $('#no-activities-span').show();
        //                                                             }
        //                                                         },
        //                                                         sort: { field: 'CreatedAt', dir: 'desc' }
        //                                                     });
        //Custome Data source
        var notificationsDataSource = new kendo.data.DataSource({
                                                                    
                                                                    transport: {
                read: {
                                                                                url:function(options) {
                                                                                    return appSettings.apiUrl + 'action=notifications&usergroup=' + appSettings.userGroup + '';
                                                                                }
                                                                                ,   
                                                                                dataType: "json",
                                                                                data: {
                                q: "javascript"
                                                                                 
                            }
                                                                            }
            },schema: {
                model: {
                       
                        fields: {
               
                                title: {
                                            field: 'push_title',
                                            defaultValue: ''
                                        },
                                text:{
                                            field:'push_text',
                                            defaultValue:''
                                        }
                                            
                                
                               
                            
                            },
                        
                    },
                data: "results" 
             
            
            }
                                                                });
        
        return {
            notications: notificationsDataSource
        };
    }());

    // Activities view model
    var activitiesViewModel = (function () {
        // Navigate to activityView When some activity is selected
        var init = function() {
        };
        var show = function() {
            //$("#notification-listview").kendoListView({
            //                                              dataSource: notificationsModel.notications,
            //                                              template: kendo.template($("#notificationTemplate").html()),
            //                                              pullToRefresh: true,
            //                                              appendOnRefresh: true,
            //                                          });
        };

        // Logout user
        var logout = function () {
        };
       
        return {
            show:show,
            init:init,
            activities: notificationsModel.notications,
           
            logout: logout
        };
    }());
    
    return activitiesViewModel;
}());