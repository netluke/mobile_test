$('document').ready(function(){
  // FACEBOOK
  $("#login_footer_facebook").each(function(){
    new MBP.fastButton(this, function() {
      alert("Facebook!");
    }); 
  });

  // ENTRA
  $("#login_content_enter").each(function(){
    new MBP.fastButton(this, function() {
      alert("Login!");
      login();
    }); 
  });

  // TWITTER
  $("#login_footer_twitter").each(function(){
    new MBP.fastButton(this, function() {
      alert("Twitter!");
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

// Funzione di Login.
function login()
{
	/*
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	*/
	
	var people = { nick : 'luca.maroccia', pw : 'netluke29' }
	
	var crud_json = JSON.stringify(people);


	var ajax = getXmlHttpObject();
	
	if(ajax) 
	{
        alert("AJAX");
		ajax.onreadystatechange = vai;
		
		ajax.open("POST", "http://www.peez.it/services/loginService.asmx/serverAction", true);
		// ajax.send();
		
		//ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		
		ajax.setRequestHeader("Content-type","application/json; charset=UTF-8");
		
		var invio = "{'crud_json':'"+crud_json+"'}";
		
		alert(invio);
		
		ajax.send(invio);		
		
		// ajax.send("{'crud_json':'" + crud_json + "' }");		
		
		// ajax.send("{'crud_json':{'user':'luca.maroccia','password':'netluke29'}}");
		
		// ajax.send('{crud_json:{"user":"luca.maroccia","password":"netluke29"}}');
	}
	else alert("Impossibile caricare il Componente XMLHttpRequest!");
	
		function vai()
		{
			if( (ajax.readyState == 4) )
			{
				alert(ajax.responseText);
				
				var people2 = {}
				
				// var people2 = ajax.responseText;
				var people2 = JSON.parse(ajax.responseText);								
				
				var people3 = JSON.parse(people2["d"]["JSON"]);
				// document.writeln(JSON.stringify(people2));		
				// alert(people2["d"]["JSON"]);
				alert(people3.token);
			}			
		}
}