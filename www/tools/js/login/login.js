/**
 * Inizializzazione di Phonegap. 
 *
function init()
{
    document.addEventListener("deviceready", onDeviceReady, false); 
}

function onDeviceReady()
{
    isPhonegapReady = true;
    alert("OK");    
}
*/

$('document').ready(function(){

  // ENTRA
  $("#login_content_enter").each(function(){
    new MBP.fastButton(this, function() {
      //alert("Login!");
      //loginJquery();
        //login();

      return loginService();

    }); 
  });

  // FACEBOOK
  $("#login_footer_facebook").each(function(){
    new MBP.fastButton(this, function() {
      alert("Facebook!");
      window.location.href = "http://www.peez.it/socialer/mobile/Facebook";
    }); 
  });

  // TWITTER
  $("#login_footer_twitter").each(function(){
    new MBP.fastButton(this, function() {
      alert("Twitter!");
      checkNavigation("http://www.peez.it/socialer/mobile/Twitter");
    }); 
  });  

  // GOOGLE
  $("#login_footer_google").each(function(){
    new MBP.fastButton(this, function() {
      alert("Google!");
    }); 
  });

  // REGISTRATI
  $("#login_content_register").each(function(){
    new MBP.fastButton(this, function() {
      alert("Registrazione!");
    }); 
  });

  // LINKEDIN
  $("#login_footer_linkedin").each(function(){
    new MBP.fastButton(this, function() {
      alert("Linkedin!");
    }); 
  });

  // QR-CODE
  $("#login_qr_catch").each(function(){
    new MBP.fastButton(this, function() {
      alert("QR-CODE!");
    }); 
  });      
});


//#region Login via xmlhttpobject

function getXmlHttpObject()
{
	var obj = null;
	
	try
	{
		// Firefox, Opera 8.0+, Safari
		obj = new XMLHttpRequest();
	}
	catch(e)
	{
		// Internet Explorer
		try
		{
			obj = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e)
		{
			obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return obj;
}

function login()
{
	
    //#region Note

/*
	people = {peezs:undefined,id:undefined,titolo:undefined,nome:undefined,cognome:undefined,nick:undefined,outputname:undefined,nato_on:undefined};
	loggedPeople = {id_stato:undefined,preference:undefined,emails:undefined,phones:undefined,socials:undefined,media:undefined,geo_addresses:undefined,confidentships:undefined,confidentships1:undefined,confidents:undefined,peezs:undefined,id:undefined,titolo:undefined,nome:undefined,cognome:undefined,nick:undefined,outputname:undefined,nato_on:undefined};
	password = {oldPass:undefined,newPass:undefined};
	preference = {id_culture:undefined,culture:undefined,id_privacy:undefined,id_startPage:undefined,social_PUBLISH:undefined};
	email = {id:undefined,account:undefined,token_public:undefined,CONFIRMED:undefined,id_tipo:undefined,icon:undefined};
	phone = {id:undefined,number:undefined,token_public:undefined,id_tipo:undefined,icon:undefined,id_code:undefined,flag:undefined,prefix:undefined};
	media = {id:undefined,PROFILE:undefined,CLIP:undefined,PREVIEW:undefined,titolo:undefined,note:undefined,width:undefined,height:undefined,prw_X1:undefined,prw_Y1:undefined,prw_X2:undefined,prw_Y2:undefined,prw_W:undefined,prw_H:undefined,updated_on:undefined,id_tipo:undefined,icon:undefined};
	geo_address = {id:undefined,indirizzo:undefined,nome:undefined,lat:undefined,latCX:undefined,latDM:undefined,lng:undefined,lngCX:undefined,lngDM:undefined,type:undefined,zoom:undefined,city:undefined,updated_on:undefined,id_cap:undefined,cap:undefined};
	social = {id:undefined,image:undefined,id_tipo:undefined,icon:undefined};
	confident = {id:undefined,peoples:undefined,peoples1:undefined,people:undefined};
	peez = {id:undefined,peoples:undefined,id_privacy:undefined,id_stato:undefined,created_on:undefined,createdOn:undefined,updated_on:undefined,updatedOn:undefined,stopped_on:undefined,stoppedOn:undefined,nome:undefined,slogan:undefined,peezs_subcats:undefined,subcat:undefined,qrs:undefined,qr:undefined,peezs_covers:undefined,cover:undefined,peezs_medias:undefined,medias:undefined,peezs_geo_address:undefined,geo_addresses:undefined,peezs_phones:undefined,peezs_emails:undefined,peezs_socials:undefined,contacts:undefined,reputation:undefined,votes:undefined,picks:undefined};
	subCat = {id:undefined,nome:undefined,id_cat:undefined,cat:undefined};
	qr = {id:undefined,QR:undefined};
	pick = {id:undefined,id_tipo:undefined,created_on:undefined,createdOn:undefined,TRASHED:undefined,trashed_on:undefined,trashedOn:undefined};
	vote = {id:undefined,id_people:undefined,value:undefined,feedback:undefined,created_on:undefined,createdOn:undefined};
	dateRange = {fromDate:undefined,toDate:undefined};
*/

    //#endregion

	var username = $("#login_content_username").val();
	var password = $("#login_content_password").val();

	// luca.maroccia	netluke29
	
	var people = {};
	people.nick = username;
	people.pw = password;

	var crud_json = JSON.stringify(people);

	var ajax = getXmlHttpObject();
	
	if(ajax) 
	{
		ajax.onreadystatechange = risposta_server;
		
		ajax.open("POST", "http://www.peez.it/services/loginService.asmx/serverAction", true);
		
		ajax.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		
		var invio = "{'crud_json':'"+crud_json+"'}";
		
		ajax.send(invio);
	}
	else 
	{
		// Paginetta errore di sistema.

		alert("Impossibile caricare il Componente XMLHttpRequest!");
	}
	
		// Risposta del server.
		function risposta_server()
		{
			if( ajax.readyState == 4 )
			{				
				var responseFinal = JSON.parse(ajax.responseText);								
				var errorFromServer = JSON.parse(responseFinal["d"]["errore"]);

				if(errorFromServer)
				{
					alert("LOGIN ERRATA");
				}
				else // LOGIN OK
				{
					var people3 = JSON.parse(responseFinal["d"]["JSON"]);
					alert(people3.token);
				}
			}			
		}
}

//#endregion

//#region login errors
var errorCode = {};
errorCode.login = "login assente";
errorCode.password = "password assente";
function loginError(errorCode) {

    if (errorCode !== undefined) {
        alert(errorCode);
    }

    //importante, deve uscire false
    return false;

}
//#endregion

//#region Login via JQUERY
function loginJquery() {

    var peopleLogin = {};
    var username = $("#login_content_username").val();
    var password = $("#login_content_password").val();

    if (username === 'nothing' || username.length <= 0) { return loginError(errorCode.login); }
    if (password === 'nothing' || username.length <= 0) { return loginError(errorCode.password); }
        
    peopleLogin.nick = username;
    peopleLogin.pw = password;


    $.ajax({
        data: "{'crud_json':'" + JSON.stringify(peopleLogin) + "' }",

        type: "POST",
        dataType: "json",
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/json;charset=UTF-8");
            }
        },
        url: "http://www.peez.it/services/loginService.asmx/serverAction",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (msg) {
            var crud_result = JSON.parse(msg.d.JSON);
            alert(crud_result.token);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('errore');

        }
    });


}
//#endregion

//#region Login via service

var peopleLogin = {};
function loginService(username, password) {

    var username = $("#login_content_username").val();
    var password = $("#login_content_password").val();

    if (username === 'nothing' || username.length <= 0) { return loginError(errorCode.login); }
    if (password === 'nothing' || username.length <= 0) { return loginError(errorCode.password); }

    peopleLogin.nick = username;
    peopleLogin.pw = password;

    return people_login(peopleLogin);
    
}

//callback post login
function loginServiceCallback(crud_result) {

    alert(crud_result.message);
}

//#endregion


