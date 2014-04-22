var version = '0.1'; // version in production
var urlHTMLDefault = 'version/blogv' + version + '.html';

/* DOM Ready and events function */
$(document).ready(function() {

  // Initialize
  webService.checkLogin();
  webService.loadBlog(urlHTMLDefault);

  //General events
  $('.version-button').on("click", events.versionButton);
  $('#logElement').on("click", events.loginLogout);
  $('#logForm').on('submit', events.login);
  $('#logout button').on('click', webService.logout);
  $(document).on('click', events.hidePopUp);

});

/*
 * Events binding by version
 */
function bindVersionEvents() {
  if (version == "0.1") {

  } else if (version == "0.2") {
  	
  }
}

// Manage HTML DOM for each version page
function customDisplayForVersion() {
  var oneDayToSeconds = 24*60*60;
  if (version == "0.1") {

  } else if (version == "0.2") {
    $("#formVersionName").remove();
    $("#pollResults").show();
    $('#pollResults .alert-success').remove();
    webService.loadPollResult('versionName');
    buildProgress($('.percentage'));
  }
}

// Build poll results graph
function buildGraph(status,results){
  _.each(results, function(item){
    $('#pollResults .results-wrapper').append(item.label + " : " + item.recs.length + "<br/>");
  });
  if(status != 200){
    $('#pollResults p.alert-success').removeClass('alert-success')
                                     .addClass('alert-error')
                                     .html(text[status] + '<br/>' + text["alert_pollsErrors" + status]);
  }
  if (status != 401) {
    localStorage["voteTime"] = Date.now();
  }
}

// Build progress bar for blog
function buildProgress(percentages){
  if(percentages.length > 0){
    _.each(percentages, function(item){
      var $item = $(item);
      var percentage = parseInt($item.html().replace('%',''),10);
      var width = $item.width();
      var color = $item.css('color');
      $item.css('background-color',color);
      $item.width(width*percentage/100);
    });
  }
}

/*
 * Events Callback
 */
var events = {
  versionButton : function(e) {
    e.preventDefault();
    if (version != $(e.currentTarget).attr('ref')){
      version = $(e.currentTarget).attr('ref');
      var url = 'version/blogv' + version + '.html';
      webService.loadBlog(url);
    }
  },
  loginLogout : function(e){
    $('#logContainer').show();
  },
  login : function(e){
    e.preventDefault();
    var param = {
      userEmail :$('#loginUser').val(),
      userPwd : $('#loginPwd').val()
    };
    webService.login(param);
  },
  pollForNameVersion : function(e) {
    e.preventDefault();
    $("#formVersionName").remove();
    $("#pollResults").show();
    localStorage["versionName" + version] = choice;
    webService.loadPollResult('versionName',choice);
  },
  hidePopUp : function(e){
    var logBox = $('#logBox');
    
    if(!logBox.is(e.target) && logBox.has(e.target).length === 0){
      $('#logContainer').hide();
    }
  }
};

/*
 * Labels bundle
 */
var text = {
  alert_localStorage : "Vous ne pouvez accédez au sondage, votre navigateur ne supporte pas une fonctionnalité nécessaire pour le bon fonctionnement du vote. Veuillez mettre à jour votre navigateur.",
  alert_pollsErrors401 : "Votre vote n'a pu être pris en compte, Veuillez réessayer.",
  alert_pollsErrors403 : "Votre vote n'a pu être pris en compte car vous avez déjà voté dans les dernières 24h.",
  "401" : "Vous devez être authentifié pour accéder à cette ressource.",
  "403" : "Vous n'avez pas accès à cette ressource"
};