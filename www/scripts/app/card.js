/**
 * Card view model
 */

function calculateCode(activity) {
    debugger;
  return activity.code;
}

function richiediSconto(code){
    
  $.ajax({
        url: appSettings.apiUrl + 'action=richiediSconto',
        type:"POST",
        data:{ code:codestring},
        success:function(result) {
            alert("La tua richiesta di sconto è stata inviata");
        //   result = JSON.parse(result);
            app.mobileApp.hideLoading();
  },error : function(error) {
      app.mobileApp.hideLoading();
  }
  });  
}

        function changeshop(el){
            localStorage.setItem("uid",el.value);
            localStorage.setItem("last_selected_shop",el.value);
            loadshop_sconto();
        }

        function loadshop_sconto(){
           
            var id=localStorage.getItem("uid");
            if(localStorage.getItem("uid")==null)
                id=0;
            localStorage.removeItem("uid");
            
            $.get(appSettings.apiUrl + 'action=getshop&id=' + id+'&userid='+appSettings.userId,function(response){

                if(response=='{"results":[]}')
                    return;

                var shop=JSON.parse(response);
                var shopselect=shop.results.shopselect;
                    shop=shop.results[0];


                var a=appSettings.projectUrl;
                var b=shop.foto1.replace("../","");
                var c=a+b;
                $(".shop_negozio").css("background","url('"+c+"')");
                $(".shop_negozio").css("background-repeat","round");
                $(".shop_profilo").css("background-image",'url('+appSettings.projectUrl+shop.negoziante.replace("../","")+')');
                $("#Profilo_shop2").hide();
                $("#Sconto").show();
                $('.footer_icon').removeClass('active');
                $('.footer_icon.footer_news').addClass('active');
                
                $(".shop_nome_negozio").text(shop.name);
                $(".buttonActionView select").html("");

                for(var i=0;i<shopselect.length;i++){
                    if(shop.id==shopselect[i].id){
                        var opt="<option value='"+shopselect[i].id+"' selected>"+shopselect[i].name+"</option>";
                        localStorage.setItem("contattaci",shop.email);
                    }
                    else
                        var opt="<option value='"+shopselect[i].id+"'>"+shopselect[i].name+"</option>";
                     $(".buttonActionView select").append(opt);
                }

                $('#backButton').attr('href', 'views/shops.html');
                var code = calculateCode(shop);
                $("#shop_Sconto").show();
                codestring=code;
                $('.footer_icon.footer_news>img').attr('src','styles/images/icona-news.png');
                $('.footer_icon.footer_shops>img').attr('src','styles/images/icona-negozio.png');
                $('.footer_icon.footer_shop>img').attr('src','styles/images/icona-sconto-active.png');
            })

         }
        function loadshop(){
            var id=localStorage.getItem("uid");
            localStorage.removeItem("uid");
            
            $.get(appSettings.apiUrl + 'action=getshop&id=' + id+'&userid='+appSettings.userId,function(response){

                if(response=='{"results":[]}')
                    return;

                var shop=JSON.parse(response);
                var shopselect=shop.results.shopselect;
                    shop=shop.results[0];


                var a=appSettings.projectUrl;
                var b=shop.foto1;
                var c=a+b;

                $(".shop_negozio").css("background","url('"+c.replace("../","")+"')");
                $(".shop_negozio").css("background-repeat","round");
                $(".shop_profilo").css("background-image",'url('+appSettings.projectUrl+shop.negoziante.replace("../","")+')');
                $("#Sconto").hide();
                $("select").hide();
                $("#Profilo_shop #via").text(shop.via);
                $("#Profilo_shop #citta").text(shop.citta);
                $("#Profilo_shop #tel").text(shop.tel);
                $("#Profilo_shop #email").text(shop.email);
                var orari=eval(shop.orari);
                var week_day=new Date();
                week_day=week_day.getUTCDay();
                // utc 0 = domenica 6=sabato
                switch(week_day){
                  
                  case 0: //domenica
                  orari=orari[6];
                  break;

                  case 1: //lunedi
                  orari=orari[0];
                  break;

                  case 2: //martedi
                  orari=orari[1];
                  break;

                  case 3: //martedi
                  orari=orari[2];
                  break;

                  case 4: //martedi
                  orari=orari[3];
                  break;

                  case 5: //martedi
                  orari=orari[4];
                  break;

                  case 6: //martedi
                  orari=orari[5];
                  break;
                }
                if(orari.length){
                  $("#Profilo_shop #aperto").show();
                  $("#Profilo_shop c").show();
                  $("#Profilo_shop #fascia1").text(orari[0]);
                  $("#Profilo_shop #fascia2").text(orari[1]);


                }
                else
                  $("#Profilo_shop #aperto").hide();
              
                $("#Profilo_shop").show();
                $("#Sconto").hide();
                $('.footer_icon').removeClass('active');
                $('.footer_icon.footer_news').addClass('active');
                
                $(".shop_nome_negozio").text(shop.name);
                $(".copunDescription").text(shop.testo);
                $(".buttonActionView select").html("");

                for(var i=0;i<shopselect.length;i++){
                    if(shop.id==shopselect[i].id){
                        var opt="<option value='"+shopselect[i].id+"' selected>"+shopselect[i].name+"</option>";
                        localStorage.setItem("contattaci",shop.email);
                    }
                    else
                        var opt="<option value='"+shopselect[i].id+"'>"+shopselect[i].name+"</option>";
                     $(".buttonActionView select").append(opt);
                }

                $('#backButton').attr('href', 'views/shops.html');
                var code = calculateCode(shop);
                $("#shop_Sconto").show();
                codestring=code;
                $('.footer_icon.footer_news>img').attr('src','styles/images/icona-news.png');
                $('.footer_icon.footer_shops>img').attr('src','styles/images/icona-negozio-active.png');
                $('.footer_icon.footer_shop>img').attr('src','styles/images/icona-sconto.png');
            })

         }

var codestring="";

var app = app || {};
        var activitySelected = function(uid) {
            
//                app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
                    localStorage.setItem("uid",uid);
                app.mobileApp.navigate('views/shop.html');
        };   
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
                        
                        return appSettings.apiUrl + 'action=getshops&userid=' + appSettings.userId;
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
                    },
                    PictureUrl: function() {
                      return appSettings.projectUrl + this.foto1;
                    },
                    sharedColor: function() {
                      return 'display:block;';
                    },
                    itemIdentifier: function() {
                        return this.id;
                    },
                    getCost: function() {
                    },
                    getTitle: function() {
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

      
         var details = function() {
             loadshop();
        };
        var show = function() {
            $.get(appSettings.apiUrl + 'action=getshops&userid=' + appSettings.userId,function(response){
                var shops=JSON.parse(response);
                $("ul#shop-list").html("");
                for(var i=0;i<shops.results.length;i++){
                    var shop=shops.results[i];
                    var li='<li data-uid="'+shop.id+'" class="li_list_default" data-role="touch" onclick="activitySelected('+shop.id+')">'+
                                '<div class="cf">'+
                                    '<div class="activity-content">'+
                                        '<div>'+
                                            '<div class="topheader gradient titleFont">'+
                                            ' <a class="topheader-time mockupTitle" title="">'+shop.name+'</a>'+
                                        ' </div>'+
                                        '  <dic class="activity-body" data-role="touch" style="touch-action: pan-y;">'+
                                            '  <div data-bind="visible: Picture" style="line-height: 180px;">'+
                                                '  <div class="image_conteiner" style="display: block!important;background-image: url(\''+appSettings.projectUrl + shop.foto1+'\');background-repeat: round;height: 180px;">'+
                                                    ' <span class="descriptiontext mockuptest">'+shop.name+'</span>'+
                                                ' </div>'+
                                                '</div>'+
                                            '</dic>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                    '</li>';
                    $("ul#shop-list").append(li);
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
                $(".image_conteiner").show();
                $('.footer_icon.footer_news>img').attr('src','styles/images/icona-news.png');
                $('.footer_icon.footer_shops>img').attr('src','styles/images/icona-negozio-active.png');
                $('.footer_icon.footer_shop>img').attr('src','styles/images/icona-sconto.png');
           })
        };
        // Navigate to app home

        var navigateHome = function() {
            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function() {};

        return {
            details: details,
            show: show,
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            logout: logout
        };
    }());

    return activitiesViewModel;
}());