var systemDB;

/* Inizializzo la varibile globale systemDB che permetta l'accesso al DB. */

/* MODIFICHE: Provo ad aprire peezdb, come se esistesse, solo se non esiste lo creo e lancio la creazione di tutte le tabelle. 
 * Suddividere la creazione delle tabelle in più funzioni.
*/

function initDB()
{
  try 
  {
      if( !window.openDatabase ) 
      {
          alert('DB non supportato dal browser di sistema!');
      } 
      else 
      {
          var shortName = 'peezdb';
          var version = '1.0';
          var displayName = 'Peez Database';
          var maxSize = 5 * 1024 * 1024; // In Byte.
          var myDB = openDatabase(shortName, version, displayName, maxSize);
      }
  } 
  catch(e) 
  {
      // Gestione degli errori legati al DB.
      switch(e)
      {
          case '0':
            alert("Errore di sistema, non dovuto al DB: "+e);
          break;

          case '1':            
            alert("Errore incerto, realtivo alla creazione del DB: "+e);  // INVALID_STATE_ERR
          break;

          case '2':            
            alert("Versione del DB richiesto, diversa da quello già presente: "+e);
          break;
      }

      return;
  }

  // Creazione tabelle lingua.
  create_Tables1_Language(myDB);
  create_Tables2_Reference(myDB);
  create_Tables3_People(myDB);
  create_Tables4_Media(myDB);


  systemDB = myDB;


  // Mette in sessione il link al BD, per condividerlo tra le varie pagine e non aprire n connessioni al DB.
  sessionStorage.setItem("systemDB", systemDB);

  // Mette in sessione dbReady, una variabile booleana che indica se il DB è pronto per essere usato, quindi, o già esiste o tutte le tabelle sono state create con successo.
  // sessionStorage.setItem("dbReady", dbReady);
}


/* Blocca la transizione. */
function killTransaction(transaction, error)
{
  return true; // errore fatale di transizione.
}

/* Gestore dell'errore con messaggio. */
function errorHandler(transaction, error)
{
    alert('Errore query: '+error.message+' codice: '+error.code);

    // Gestione errori.
    var fatal_error = true;
    if (fatal_error) return true;
    return false;
}

/* Gestore chiamato quando non viene ritornato alcun valore dalla transizione. */
function nullDataHandler(transaction, results)
{
}











