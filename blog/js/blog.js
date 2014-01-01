var version = '0.2'; // Default version
var urlHTMLDefault = 'version/blogv' + version + '.html';

/* DOM Ready and events function */
$(document).ready(function() {

  // Initialize
  webService.loadBlog(urlHTMLDefault);

  //General events
  $('.version-button').on("click", events.versionButton);

});

// Events for each version page
function bindVersionEvents() {
  if (version == "0.1") {

  } else if (version == "0.2") {
    $('#formVersionName').on("submit", events.pollForNameVersion);
  }
}

// Manage HTML DOM for each version page
function customDisplayForVersion() {
  if (version == "0.1") {

  } else if (version == "0.2") {
    if ( typeof localStorage == undefined) {
      $("#formVersionName").remove();
      $("#pollResults").show();
      $("#pollResults .alert").html(text.alert_localStorage);
      webService.loadPollResult('versionName');
    }/*else if (localStorage["versionName" + version] !== undefined){
      $("#formVersionName").remove();
      $("#pollResults").show();
      webService.loadPollResult('versionName');
    }*/
  }
}

// Handle events callback
var events = {
  versionButton : function(e) {
    e.preventDefault();
    version = $(e.currentTarget).attr('ref');
    var url = 'version/blogv' + version + '.html';
    webService.loadBlog(url);
  },
  pollForNameVersion : function(e) {
    e.preventDefault();
    var choice = $("#formVersionName input:checked").val();
    if (choice === undefined) {
      $("#formVersionName .alert").show();
    } else {
      $("#formVersionName").remove();
      $("#pollResults").show();
      localStorage["versionName" + version] = choice;
      webService.loadPollResult('versionName',choice);
    }
    // put the choice in local storage to choice once
  }
};

// All ajax call
var webService = {
  loadBlog : function(url){
    $.ajax(url).done(function(data) {
      $('div.content').html(data);
      bindVersionEvents();
      customDisplayForVersion();
    });
  },
  loadPollResult : function(type,choice){
    console.log(type,version,choice);
  }
};

/*
 * 
 */
var text = {
  alert_localStorage : "Vous ne pouvez accédez au sondage, votre navigateur ne supporte pas une fonctionnalité nécessaire pour le bon fonctionnement du vote. Veuillez mettre à jour votre navigateur."
};
