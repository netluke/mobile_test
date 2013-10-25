/// <reference path="~/Scripts/peez-objects.js" />

//#region NOTE
//CRUD proxy -> crud service
//per i valori dell'errore post web service proxy: http://forums.asp.net/t/1277880.aspx/1

//FUNZIONAMENTO:
//ACTION riceve la richiesta dai singoli bottoni, già PRONTA con il json ed i vari parametri di comando, tipo di oggetto, etc etc
//la richiesta viene mandata al SERVER in formato crud_request, ricevedone un crud_response
//a quel punto viene chiamato una prassi di callback che può eventualmente effettuare del JS (come eliminare l'oggetto dalla UI)

//crud_request
//command type - command_type
//obj type - obj_Type
//(json) - STRING

//crud_result:
//success - bool
//error - BOOL
//message - STRING
//(html) - STRING
//(REDIRECT) - STRING
//JS - string


//#endregion

//#region VARS
var $crud_button; // button in uso
var crud_silence = true; //impostato a true se non si vuole notificare l'utente del crud
var crud_buttonDisable = false; // impostato a true se si vuole che il button rimanga disabilitato (in OK result)

var crud_callbacks = {}; //JS da richiamare post aggiornamento riuscito
crud_callbacks.parse = function (str) {
    var val = crud_callbacks[str];
    if (val !== undefined) {
        return (val);
    } else {
        for (key in crud_callbacks) {
            if (str == crud_callbacks[key]) {
                return (crud_callbacks[key]);
            }
        }
    }
    return undefined;
};

crud_request = {
    command: undefined,
    obj: undefined,
    json: undefined
};

var crud_timeout = 15000;

var command_separator = '|';
var command_value = '=';

//MESSAGEBOX master
var mastermessagebox = "box_master";

//#endregion

//#region EVENTS

//binding degli eventi
function bindcrudevents() {
    //default success callback post service call
    crudService.set_defaultSucceededCallback(crudOK);
    //default fail callback post service call
    crudService.set_defaultFailedCallback(crudFAIL);
    //imposta il timeout
    crudService.set_timeout(crud_timeout);

}

// ok callback
function crudOK(result, userContext, methodName) {

    progressHide();
    result.errore = false;

    //OCCHIO
    //crud_result = result;

    //button re-enable, se non doveva rimanere disabilitato!
    if ($crud_button !== undefined && crud_buttonDisable !== true) {
        $crud_button.removeClass(css_DISABLED);
        $crud_button = undefined;
    }
    
    //silence
    if (crud_silence == false) {
        $mastermessagebox = $('#' + mastermessagebox);
        if ($mastermessagebox !== undefined) {
            var messboxtype = result.errore == false ? message_type.success : message_type.error;
            $mastermessagebox.val(result.message);
            $mastermessagebox.attr(attr_TYPE, messboxtype);
            $mastermessagebox.attr(attr_POSITION,toastr_position.bottomLeft);
            messagebox_action($mastermessagebox);
        }
    }
    
    //ricarica il callback JS dall'array dei callbacks
    var crud_callback_name = result.command + command_separator + result.obj
    var crud_callback = crud_callbacks.parse(crud_callback_name);
   
    if (crud_callback !== undefined) {
       // crud_callbacks.crud_callback = null;
        crud_callbacks[crud_callback_name] = null;
        crud_callback(result);
    }
    
}
// fail callback
function crudFAIL(error, userContext, methodName) {
    var crud_result = function () { };
    var crud_callback; //JS da richiamare post aggiornamento

    progressHide();

    if ($crud_button != undefined) {
        $crud_button.removeClass(css_DISABLED);
        $crud_button = undefined;
    }
    
    if (crud_silence == false) {
        $mastermessagebox = $('#' + mastermessagebox);
        if ($mastermessagebox != undefined && error != undefined) {
            //errore di timeout ?
            if (error.get_timedOut()) {
                $mastermessagebox.val(msg_serviceTimeout); // definita in master page
                $mastermessagebox.attr(attr_TYPE, message_type.warning);
            }
            else {
                $mastermessagebox.val(error.get_message());
                $mastermessagebox.attr(attr_TYPE, message_type.error);
            }
            $mastermessagebox.attr(attr_POSITION, toastr_position.topRight);
            messagebox_action($mastermessagebox);
        }
    }
    crud_result.errore = true;

    //callback JS
    if (error.JS != undefined) {
        //evalJS(crud_callback);// + '(' + result + ')');
        crud_callback = error.JS;
        crud_result.js = crud_callback;

        crud_callback(crud_result);

    }
}

//#endregion

//#region SUPERACTIONS

//superaction per le azioni di CRUD: RETURN FALSE così da evitare di andare avanti....
///bottone, command_type, obj_type, json coi dati da mandare e JS da chiamare in callback
function CRUD_action(button, validation, command, obj, json, js, SILENCE, BUTTONDISABLE) {

    //jquery del bottone che ha generato l'evento
    $crud_button = $('#' + button);

    // bool per capire se deve inoltrare il messaggio ricevuto in response (toastr)
    crud_silence = SILENCE;
    // bool per capire se deve riabilitare il bottone dopo l'OK
    crud_buttonDisable = BUTTONDISABLE;

    //esce se il bottone era disabilitato
    if ($crud_button.hasClass(css_DISABLED)) { return false; }

    //verifica che esista la validazione
    if (typeof (Page_ClientValidate) == 'function' && validation != undefined) {
        Page_ClientValidate(validation);
        //esce se la validazione (eventuale) è andata a buon fine
        if (!Page_IsValid) { return false; }
    }

    //creo un json vuoto, se era undefined
    if (json === undefined) { json = JSON.stringify(null); }

    //init actions
    progressShow();
    $crud_button.addClass(css_DISABLED);

    crud_request.command = command_type.parse(command);
    crud_request.obj = obj_type.parse(obj);
    crud_request.json = json;
    //crud_request.callback = crud_callback;

    // js richiamato dal default ok callback
    var crud_callback_name = crud_request.command + command_separator + crud_request.obj;
    crud_callbacks[crud_callback_name] = js;

    //manda al SERVER, inoltrando comando, tipo di oggetto e json
    crudService.serverAction(crud_request.command, crud_request.obj, crud_request.json);

    //return false IMPORTANTE
    return false;
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

//#endregion

//#region ACTIONS

    //#region PEOPLE

    //people login
    function people_login(obj, JS) {
        return LOGIN_action(JSON.stringify(obj), JS, true, false);
    }

    //recupera il people in uso (non utilizzato alla login)
    function people_retrieve(JS) {
        return CRUD_action(undefined, undefined, command_type.retrieve, obj_type.people, undefined, JS, true, false);
    }

    ///people_update
    function people_update(JS) {

        //costruisce il json da un oggetto people: risucchia i campi via jquery
        people.nick = $('#txt_alias').val();
        people.titolo = $('#txt_titolo').val();
        people.nome = $('#txt_nome').val();
        people.cognome = $('#txt_cognome').val();
        people.nato_on = $('#txt_nascita').val();
    
        return CRUD_action('btn_mod_people_OK', 'mod_people', command_type.update, obj_type.people, JSON.stringify(people), JS, false, true)

    }

    ///people_pwupdate
    function people_pwupdate(JS) {
        var tempPW = parseInt($('#hidden_pwreset').val(), 10);
        if (tempPW >= 1) {
            //eravamo in pw provvisoria
            password.oldPass = $('#lbl_password_temp').text();
        }
        else {
            //eravamo in PW definitiva
            password.oldPass = $('#txt_people_password_OLD').val();
        }
        password.newPass = $('#txt_people_password_NEW_1').val();
        return CRUD_action('btn_resetpw_DO', 'mod_pwreset', command_type.pwupdate, obj_type.people, JSON.stringify(password), JS, false,false)
    }

    //ritorna l'IP della persona
    function people_retrieveIP(JS) {

        return CRUD_action(undefined, undefined, command_type.retrieveIP, obj_type.people, undefined, JS, true, false);
    }

    //#endregion

    //#region EMAILS

    //EMAIL CREATE
    function email_create(JS) {

        email.id = 0
        email.account = $('#txt_mod_emails_account').val();
        email.id_tipo = $('#ddl_mod_emails_type').val();
    
        return CRUD_action('btn_mod_emails_add_save', 'Required_email', command_type.create, obj_type.email, JSON.stringify(email), JS, false, false);
    
    }

    //PERSONA EMAIL LIST RETRIEVE
    function email_personaList(JS) {
        return CRUD_action(undefined, undefined, command_type.personaList, obj_type.email, undefined, JS, true, false);
    }
    //EMAIL KILL
    function email_kill(objFROMmodel, JS) {
        return CRUD_action(undefined, undefined, command_type.kill, obj_type.email, JSON.stringify(objFROMmodel), JS, true, false);
    }



    //#endregion

    //#region PHONES
    //PHONE CREATE
    function phone_create(JS) {

        phone.id = 0
        phone.number = $('#txt_mod_phones_number').val();
        phone.id_tipo = $('#ddl_mod_phones_type').val();
        phone.id_code = $('#ddl_mod_phones_code').val();

        return CRUD_action('btn_mod_phones_add_save', 'Required_phone', command_type.create, obj_type.phone, JSON.stringify(phone), JS, false, false);
    }

    //PERSONA PHONE LIST RETRIEVE
    function phone_personaList(JS) {
        return CRUD_action(undefined, undefined, command_type.personaList, obj_type.phone, undefined, JS, true, false);
    }

    //PHONE KILL
    function phone_kill(objFROMmodel, JS) {
        return CRUD_action(undefined, undefined, command_type.kill, obj_type.phone, JSON.stringify(objFROMmodel), JS, true, false);
    }

    //#endregion

    //#region MEDIA

    //UDDATE
    function media_update(JS) {
        //LAVORA sul MEDIA
        return CRUD_action('btn_mod_media_OK', undefined, command_type.update, obj_type.media, JSON.stringify(media), JS, false, true);
    }

    //MEDIA KILL
    //IL più TIPICO: JS
    function media_kill(obj, JS) {
        return CRUD_action(undefined, undefined, command_type.kill, obj_type.media, JSON.stringify(obj), JS, true, false);
    }

    //MEDIA KILL ALL
    function media_killALL(JS) {
        return CRUD_action(undefined, undefined, command_type.killALL, obj_type.media, undefined, JS, false, false)
    }


    //function media_create() {

    //    return CRUD_action(undefined, undefined, command_type.create, obj_type.media, JSON.stringify(media), JS, false, false)
    //}


    //PERSONA PROFILE SET (registra un media, ritorna un people)
    function media_personaProfile(obj, JS) {
        return CRUD_action(undefined, undefined, command_type.profile, obj_type.media, JSON.stringify(obj), JS, true, false);
    }

    //PERSONA MEDIA LIST RETRIEVE
    function media_personaList(JS) {
        //persona list di media con JS di callback e SILENZIO
        return CRUD_action(undefined, undefined, command_type.personaList, obj_type.media, undefined, JS, true, false);
    }

    //#endregion

    //#region GEO_ADDRESS

    //UDDATE
    function geo_address_update(JS) {
        //LAVORA sul geo_address
        return CRUD_action('btn_mod_address_OK', undefined, command_type.update, obj_type.geo_address, JSON.stringify(geo_address), JS, false, true);
    }

    //ADDRESS KILL
    function geo_address_kill(objFROMmodel, JS) {
        return CRUD_action(undefined, undefined, command_type.kill, obj_type.geo_address, JSON.stringify(objFROMmodel), JS, true, false);
    }

    //ADDRESS KILL ALL
    function geo_address_killALL(JS) {
        return CRUD_action(undefined, undefined, command_type.killALL, obj_type.geo_address, undefined, JS, false, false)
    }

    //PERSONA RETRIEVE
    function geo_address_personaList(JS) {
        //persona list di address con JS di callback e SILENZIO
        return CRUD_action(undefined, undefined, command_type.personaList, obj_type.geo_address, undefined, JS, true, false);
    }

    ///CREATE
    function geo_address_create(JS) {

        //lavora su mod_address_add_MODEL (backbone model)
        if (mod_address_add_MODEL != undefined) {
            //trasferisce tutti gli attributi dal backbone model al geo_address
            $.each(mod_address_add_MODEL.attributes, function (key, value) {geo_address[key] = value;});
            return CRUD_action('btn_address_add_save', undefined, command_type.create, obj_type.geo_address, JSON.stringify(geo_address), JS, false, false);
        }
        else {
            message_toastr("Problema con l'indirizzo scelto, riprova");
        }
    }

    ///geocode (search)
    function geo_address_search(JS) {

        //cap: txt_mod_addressadd_CAP
        geo_address.id_cap = $('#txt_mod_addressadd_CAP').val();

        //city: ddl_mod_addressadd_CAP_COMUNE
        geo_address.city = $('#ddl_mod_addressadd_CAP_COMUNE option:selected').text();

        //indirizzo: txt_mod_addressadd_ADDRESS
        geo_address.indirizzo = $('#txt_mod_addressadd_ADDRESS').val();
    
        return CRUD_action('btn_addaddress_search', 'mod_address_add', command_type.search, obj_type.geo_address, JSON.stringify(geo_address), JS, false, true)

    }

    ///reverse geocode (search)
    function geo_address_reverseSearch(coordinata,JS) {
        return CRUD_action(undefined, undefined, command_type.reverseSearch, obj_type.geo_address, JSON.stringify(coordinata), JS, false, false);
    }


    //#endregion

    //#region SOCIALS


    //PERSONA RETRIEVE
    function social_personaList(JS) {
        //persona list di social con JS di callback e SILENZIO
        return CRUD_action(undefined, undefined, command_type.personaList, obj_type.social, undefined, JS, true, false);
    }



    //#endregion

    //#region CONFIDENTS

    //PERSONA RETRIEVE
    function confident_personaList(JS) {
        //persona list di social con JS di callback e SILENZIO
        return CRUD_action(undefined, undefined, command_type.personaList, obj_type.confident, undefined, JS, true, false);
    }

    //KILL
    function confident_kill(objFROMmodel, JS) {
        return CRUD_action(undefined, undefined, command_type.kill, obj_type.confident, JSON.stringify(objFROMmodel), JS, true, false);
    }

    //#endregion

    //#region PREFERENCES

    //imposta soltanto la startpage
    function preference_startPage(startpage) {
        preference.id_startpage = startpage;
        return CRUD_action('chk_main', undefined, command_type.update, obj_type.preference, JSON.stringify(preference), undefined, false, true)
    }


    //TO DO: da implementare dalla pagina delle preferenze, quando creata
    function preference_update(JS) {

        //setta i vari campi di preference dalla pagina di modifica delle preferenze
        //preference.....
        //preference.id_startpage = startpage;

        return CRUD_action('btn_mod_privacy_OK', undefined, command_type.update, obj_type.preference, JSON.stringify(people.preference), JS, false, true)

    }

    //ri-retrieve della preferenza attuale - LAVORA sul people
    function preference_undo(JS) {
        return preference_retrieve( JS);
    }

    //retrieve dela preferenza utente
    function preference_retrieve(JS) {
        return CRUD_action(undefined, undefined, command_type.retrieve, obj_type.preference, undefined, JS, true, false);
    }

    //#endregion

    //#region PEEZ

    // CREATE - LAVORA sul PEEZ
    function peez_create(JS) {

        peez = {};
        peez.id = 0;
        peez.nome = $('#txt_mod_peezadd_nome').val();
        peez.id_subcat = $('#ddl_mod_peezadd_SUBCAT').val();

        //gira per i vari checkbox, finchè non trova quella checkata
        $('#pnl_mod_peez_add_welcome input[type="checkbox"]').each(function (i) {
            if (this.checked) {
                peez.id_privacy = i+1;
            }
        });

        return CRUD_action('btn_mod_peezadd_save', 'Required_peezadd', command_type.create, obj_type.peez, JSON.stringify(peez), JS, false, false);

    }

    //retrieve del singolo peez
    function peez_retrieve(obj, JS) {

        return CRUD_action(undefined, undefined, command_type.retrieve, obj_type.peez, JSON.stringify(obj), JS, true, false);
    }

    //retrieve del peez attuale (UNDO) - LAVORA sul PEEZ
    function peez_undo(JS) {
        return peez_retrieve(peez, JS);
    }

    // DELETE - LAVORA sul PEEZ
    function peez_kill(JS) {

        return CRUD_action(undefined, undefined, command_type.kill, obj_type.peez, JSON.stringify(peez), JS, true, false);
    }

    // UPDATE (SAVE) - LAVORA sul PEEZ
    function peez_update(JS) {
        return CRUD_action(undefined, undefined, command_type.update, obj_type.peez, JSON.stringify(peez), JS, false, false);
    }

    // PERSONA PEEZ LIST RETRIEVE
    function peez_personaList(JS) {
        return CRUD_action(undefined, undefined, command_type.personaList, obj_type.peez, undefined, JS, true, false);
    }

    //#endregion

//#endregion
