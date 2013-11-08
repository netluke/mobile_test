/* ########## INIZIO LANGUAGES ########## */
function create_Language_Tabels(db)
{

  // Tabella di riferimento per la lingua di sistema. Collega la lingua riconosciuta con la relativa tabella delle frasi. ES.: IT_IT --> lang_it
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "lang_ref" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "system_lang" TEXT(6) NOT NULL, "table_lang" TEXT(10) NOT NULL);', [], nullDataHandler, errorHandler);		 
      }
  );

  
  // In ogni tabella della lingua, l'id del tag viene associato con la frase da inserire.

  // Tabella lingua Italiana.
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "lang_it" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "id_tag" TEXT(50) NULL, "phrase" TEXT NULL);', [], nullDataHandler, errorHandler);
      }
  );

  // Tabella lingua Inglese.
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "lang_en" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "id_tag" TEXT(50) NULL, "phrase" TEXT NULL);', [], nullDataHandler, errorHandler);

      }
  );

}
/* ########## FINE LANGUAGES ########## */