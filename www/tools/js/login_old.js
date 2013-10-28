//people login
function people_login(obj, JS)
{
	return LOGIN_action(JSON.stringify(obj), JS, true, false);
}

//verifica credenziali
function login()
{
	people.nick = "luca.maroccia";
	people.pw = "netluke29";
	
	people_login(people, main_people_refresh, main_people_FAIL);				
}

//superaction per le azioni di LOGIN
//json coi dati da mandare e JS da chiamare in callback
function LOGIN_action(json, js, SILENCE, BUTTONDISABLE) {

    //creo un json vuoto, se era undefined
    if (json === undefined) { json = JSON.stringify(null); }
    
    //manda al SERVER, inoltrando il json
    //ATTENZIONE: verificae chiamata al js on callback
    loginService.serverAction(json,js,js);
    return true;

};


//LOGIN service
//ricordarsi di settare il cookie locale
//
loginService = {

    /// <param name="crud_json" type="String">System.String</param>
    /// <param name="succeededCallback" type="Function" optional="true" mayBeNull="true"></param>
    /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true"></param>
    /// <param name="userContext" optional="true" mayBeNull="true"></param>
    serverAction: function (crud_json,onSuccess,onFailed,userContext) {

        //default OK callback: crudOK
        //default FAIL callback: crudFAIL

        var OkCallback = onSuccess !== undefined ? onSuccess : crudOK,
            FailCallback = onFailed !== undefined ? onFailed : crudFAIL;


        $.ajax({
            data: "{'crud_json':'" + crud_json + "' }",

            type: "POST",
            dataType: "jsonp",
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            url: "http://www.peez.it/services/loginService.asmx/serverAction",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                if (eval('typeof ' + OkCallback) === 'function') {
                    OkCallback(msg.d);
                };

            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (eval('typeof ' + FailCallback) === 'function') {
                    FailCallback(xhr, ajaxOptions, thrownError);
                };
            }
        });
    }

};

//aggiornamento (iniziale) del people in uso e del profile view
function main_people_refresh(crud_result) {

	//si autorichiama nel caso in cui non sia definito il people
	if (people.id === undefined && crud_result === undefined) { return people_retrieve(main_people_refresh); }
	
	if (crud_result !== undefined) { 
	
		people = JSON.parse(crud_result.JSON); 
		
		alert(people.token);}
	
	
	//instanzio la view (people_view_32)


	return true;
}

function main_people_FAIL(xhr, ajaxOptions, thrownError){
	
	alert("PROBLEMA!");

}