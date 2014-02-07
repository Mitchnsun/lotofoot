function performWS(type, endpoint, data, success) {
  return $.ajax({
    url : endpoint,
    type : type,
    data : data,
    success : function(data) {
      if (success) {
        var jsondata;
        try {// Parse JSON
          jsondata = $.parseJSON(data);
        } catch(err) {
          jsondata = {
            status : 422,
            errorCode : 'JSON',
            error : err,
            data : data
          };
        }
        success(jsondata);
      }
    },
    error : function(xhr, ajaxOptions, thrownError) {
      console.log(xhr, ajaxOptions, thrownError);
    }
  });

}

/*
 * Webservice calls (Ajax)
 */
var webService = {
  loadBlog : function(url){
    $.ajax(url).done(function(data) {
      $('#content').html(data);
      bindVersionEvents();
      customDisplayForVersion();
      $(window).scrollTop();
    });
  },
  loadPollResult : function(type,choice){
    var data = {
      type : type,
      version : version,
      choice : choice
    };
    performWS('POST','server/polls/getSetPollVersionName.php',data,function(jsondata){
      buildGraph(jsondata.status,jsondata.results);
    });
  },
  checkLogin : function(){
    performWS('POST','server/authentication/checkLogin.php',{},function(jsondata){
      if(jsondata.logged){
        $('#logBox').removeClass('off').addClass('on');
        $('#logElement').html('On');
      }
    });
  },
  login : function(param){
    performWS('POST','server/authentication/login.php',param,function(jsondata){
      if(jsondata.user !== undefined){
        $('#logBox').removeClass('off').addClass('on');
        $('#logElement').html('On');
        $('#logContainer').hide();
      }
    });
  },
  logout : function(e){
    performWS('POST','server/authentication/logout.php',{},function(jsondata){
      if(jsondata.status == 200){
        $('#logBox').removeClass('on').addClass('off');
        $('#logElement').html('Off');
        $('#logContainer').hide();
      }
    });
  }
};
