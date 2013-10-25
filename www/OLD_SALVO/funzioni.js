
  //verifica credenziali
  function login(){
    alert("OK");
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("username").value;
    
    people.nick = "luca.maroccia"; // username
    people.pw = "netluke29"; // password
        
    people_login(people,loginOK);
  }

  //LOGIN OK, registra il token di sessione
  function loginOK(crud_result) {
	
	
			
  }	

//#region VECCHIE ROBE
	
	/*
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

function OLDLOGIN(){
	var ajax = getXmlHttpObject();
	
	if(ajax) 
	{
		ajax.onreadystatechange = vai;
		
		ajax.open("POST", "http://www.peez.it/services/loginService.asmx?username="+username+"&password="+password, true);
		ajax.send();
		
		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		ajax.send('{crud_json:{"user":"luca.maroccia","password":"netluke29"}}');
	}
	else alert("Impossibile caricare il Componente XMLHttpRequest!");
	
		function vai()
		{
			alert(ajax.responseText);
			
			if( (ajax.readyState == 4) && (ajax.status == 200) )
			{
				
				
				var stato_numero = trim(ajax.responseText);
				
				if( stato_numero == "OK" )
					document.getElementById("contratto").action = "salva_contratto.php";
				else
				{
					alert("ATTENZIONE!!!\n\nIl campo Telefono Reg. Vocale contiene un numero non valido!\n\nIl contratto non può essere salvato con questo numero!");
					document.getElementById("contratto").action = "";
				}
				
			}			
		}
  }
		
		*/



	//#endregion