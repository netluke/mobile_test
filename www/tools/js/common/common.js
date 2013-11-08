/**
 * VARIABILI GLOBALI
 */

// URL of the current page.
var currentUrl = "";

// Store PhoneGap status.
var isPhoneGapReady = false;

// Default all phone types to false
var isAndroid = false;
var isBlackberry = false;
var isIphone = false;
var isWindows7x = false;
var isWindows8x = false;

// Default language set to english
var linguaggio = "en";

// Store the current network status
var isConnected = false;
var isHighSpeed;
var internetInterval;

// Store the device's uuid
// var deviceUUID;

// jQuery Mobile framework configuration changes!
$(document).on("mobileinit", function(){
  // Their enable cross domain ajax calls.  
  $.mobile.allowCrossDomainPages = true; 
  $.support.cors = true;
});

// This gets called by jQuery mobile when the page has loaded
$(document).bind("pageload", function(event, data) {
    init(data.url);
});

$(document).bind("mobileinit", function(){
  $.mobile.page.prototype.options.addBackBtn = true;
});


// Check for deviceready event.
function init(url) 
{
    // Imposta l'url con quello della pagina corrente o con quello passato
    if (typeof url != 'string') 
    {
        currentUrl = location.href;
    } 
    else 
    {
        currentUrl = url;
    }

    if (isPhoneGapReady) 
    {
        onDeviceReady();
    } 
    else 
    {
        try
        { 
            // Add an event listener for deviceready
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        catch(e)
        {
            checkNavigation();

            var errore = e;
            serverErrorReport(errore);
            
            /* --> SE l'onDeviceReady NON VA A BUON FINE, INVITARE L'UTENTE A CHIUDERE L'APP CON UN MESSAGGIO DI ERRORE 
             * E INVIARE UN EMAIL ALL'AMMINISTRATORE O UN MESSAGGIO DI ERRORE AL SERVER CON MANCATO SUPPORTO PHONEGAP. <--
             */
        }


        /*
            Older versions of Blackberry < 5.0 don't support 
            PhoneGap's custom events, so instead we need to 
            perform an interval check every 500 milliseconds 
            to see if PhoneGap is ready.  Once done, the 
            interval will be cleared and normal processing
            can begin
        
            var intervalID = window.setInterval(function() {
                  if (PhoneGap.available) {
                      onDeviceReady();
                  }
              }, 500);
        */
    }
}


function onDeviceReady() 
{
    // For older versions of Blackberry < 5.0
    // window.clearInterval(intervalID);

    // Detect the device UUID
    // deviceUUID = device.uuid;

    isPhoneGapReady = true;     

    // detect db: open or creation.
    dbDetection();

    // detect the device's language
    languageDetection();
    
    // detect the device's platform
    deviceDetection();
    
    // detect for network access
    networkDetection();
    
    // execute any events at start up
    executeEvents();
    
    // execute a callback function
    executeCallback();
}


function dbDetection()
{

}


function languageDetection()
{
    navigator.globalization.getPreferredLanguage(function (language) { linguaggio = language.value; }, function () { linguaggio = "en"; } );    
}

function executeEvents() {
    if (isPhoneGapReady) {
        // attach events for online and offline detection
        document.addEventListener("online", onOnline, false);
        document.addEventListener("offline", onOffline, false);
        
        // attach events for pause and resume detection
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        
        // set a timer to check the network status
        internetInterval = window.setInterval(function() {
              if (navigator.connection.type != Connection.NONE) {
                onOnline();
              } else {
                onOffline();
              }
          }, 5000);
    }
}

function executeCallback() {
    if (isPhoneGapReady) {
        // get the name of the current html page
        var pages = currentUrl.split("/");
        var currentPage = pages[pages.length - 1].slice(0, pages[pages.length - 1].indexOf(".html"));
        
        // capitalize the first letter and execute the function
        currentPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
        
        if (typeof window['on' + currentPage + 'Load'] == 'function') {
            window['on' + currentPage + 'Load']();
        }
    }
}

function deviceDetection() {
    if (isPhoneGapReady) {
        switch (device.platform) {
            case "Android":
                isAndroid = true;
                break;
            case "Blackberry":
                isBlackberry = true;
                break;
            case "iPhone":
                isIphone = true;
                break;
            case "WinCE":
                isWindows7x = true;
                break;
            case "Win32NT":
                isWindows8x = true;
                break;
        }
    }
}

function networkDetection() {
    if (isPhoneGapReady) {
        // as long as the connection type is not none, 
        // the device should have Internet access
        if (navigator.connection.type != Connection.NONE) {
            isConnected = true;
        }
        
        // determine if this connection is high speed or not
        // NOT USEFUL, because devices cannot detect the type of cellular network connection, and all return Connection.CELL
        switch (navigator.connection.type) {
            case Connection.UNKNOWN:
            case Connection.CELL_2G:
            case Connection.CELL:
                isHighSpeed = false;
                break;
            default:
                isHighSpeed = true;
                break;
        }
    }
}

function onOnline() {
    isConnected = true;
}

function onOffline() {
    isConnected = false;
}

function onPause() {
    isPhoneGapReady = false;
    
    // clear the Internet check interval
    window.clearInterval(internetInterval);
}

function onResume() {
    // don't run if phonegap is already ready
    if (isPhoneGapReady == false) {
        // alert('resuming');
        init(currentUrl);
    }
}

/**
 * Questa funzione riceve in ingresso l'url da raggiungere ed esegue una serie di controlli prima di aprirla:
 * 1) Controlla se phonegap è ready, altrimenti rimanda alla pagina di errore di sistema.
 * 2) Se phonegap è ready, controlla se la connessione è attiva, altrimenti rimanda alla pagina di errore di connessione.
 * Se tutti i controlli vengono superati, viene caricata la pagira richiesta.
 */
 function checkNavigation(url)
 {
    if( isPhoneGapReady )
    {
        if( isConnected )
        {
            $.mobile.changePage( url, { transition: "slideup", changeHash: false });
        }
        else
        {
            if ( currentUrl == "index.html" )
                $.mobile.changePage( "./errors/connect_error.html", { transition: "slideup", changeHash: false });
            else
                $.mobile.changePage( "../errors/connect_error.html", { transition: "slideup", changeHash: false });
        }
    }
    else
    {
        if ( currentUrl == "index.html" )
            $.mobile.changePage( "./errors/system_error.html", { transition: "slideup", changeHash: false });
        else
            $.mobile.changePage( "../errors/system_error.html", { transition: "slideup", changeHash: false });
    }
 }

/**
 * Invia al server la stringa con l'errore e i dati utili all'errore.
 */
function serverErrorReport()
{
    var url = 'http://www.peez.it/mobile/errors/error_report.aspx';  

    $.ajax({  
        type: 'GET',  
        url: url,  
        contentType: "application/json",  
        dataType: 'jsonp',  
        data: {first: $("#first").val(), last: $("#last").val() },  
        crossDomain: true,  
     
        success: function(res) 
        {                
            console.dir(res.fullname);  
        },  
     
        error: function(e) 
        {  
            console.log(e.message);  
        },  
     
        complete: function(data) 
        {  
            console.log(e.message);  
        }  
    });
 } 

 /*
 var $has = {
    touch: "ontouchend" in document,
    orientation: "onorientationchange" in window,
    geolocation: typeof navigator.geolocation != "undefined",
    transitions: "WebKitTransitionEvent" in window,
    canvas: !!document.createElement("canvas").getContext,
    audio: !!document.createElement("audio").canPlayType,
    localStorage: "localStorage" in window,
    webDB: "opendatabase" in window
  };
*/

/*
// APP EXIT
if (navigator.app && navigator.app.exitApp) 
{
    navigator.app.exitApp();
} else if (navigator.device && navigator.device.exitApp) 
{
    navigator.device.exitApp();
}
*/