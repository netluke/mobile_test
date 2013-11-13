var qr = { value : 8 };  // numero dopo l'ultimo slash

var peez_obj;

funcion callback(crud_result)
{
	if(crud_result !== undefined && crud_result.errore === false) 
	{ 
		if (crud_result.success) 
			{
				peez_obj = JSON.parse(crud_result.JSON);

				
			};
	};
}

qr_retrive(qr, callback);

