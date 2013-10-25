/// <reference path="peez-objects.js" />
/// <reference path="peez-crud.chirp.js" />

//#region NOTE

//implementato jsonp come metodo di comunicazione per il cross domain XHR problem
//http://stackoverflow.com/questions/7333132/phonegap-jquery-ajax-to-invoke-a-webservice
//http://bloggingabout.net/blogs/adelkhalil/archive/2009/08/14/cross-domain-jsonp-with-jquery-call-step-by-step-guide.aspx

//registrare post login il cookie _peez con people.sessionID

//#endregion

//#region MOBILE services

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

//master service
crudService = {


    /// <param name="crud_command" type="Number">System.Int32</param>
    /// <param name="crud_obj" type="Number">System.Int32</param>
    /// <param name="crud_json" type="String">System.String</param>
 
    /// <param name="fromDate" type="Number">System.Int64</param>
    /// <param name="toDate" type="Number">System.Int64</param>
    /// <param name="limit" type="Number">System.Int32</param>
    /// <param name="requestW" type="Number">System.Int32</param>
    /// <param name="requestH" type="Number">System.Int32</param>

    /// <param name="succeededCallback" type="Function" optional="true" mayBeNull="true"></param>
    /// <param name="failedCallback" type="Function" optional="true" mayBeNull="true"></param>
    /// <param name="userContext" optional="true" mayBeNull="true"></param>
    serverAction: function(crud_command,crud_obj,crud_json,fromDate,toDate,limit,requestW,requestH,onSuccess,onFailed,userContext){
       
        var OkCallback = onSuccess !== undefined ? onSuccess : crudOK,
           FailCallback = onFailed !== undefined ? onFailed : crudFAIL;

      $.ajax({
          data: "{'crud_command':'" + crud_command +
              "', 'crud_obj':'" + crud_obj +
              "', 'crud_json':'" + crud_json +
              "', 'fromDate':'" + fromDate +
              "', 'toDate':'" + toDate +
              "', 'limit':'" + limit +
              "', 'requestW':'" + requestW +
              "', 'requestH':'" + requestH +
              "' }",
              type: "POST",
              dataType: "jsonp",
              beforeSend: function (x) {
                  if (x && x.overrideMimeType) {
                      x.overrideMimeType("application/j-son;charset=UTF-8");
                  };
              },
              url: "http://www.peez.it/services/crudService.asmx/serverAction",
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

//#endregion