/* ########## TABELLE DI RIFERIMENTO PER FOREIGN KEYS ########## */
function create_Reference_Tables(db)
{
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "privacy_tipo" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "nome" TEXT(100) NOT NULL);', [], nullDataHandler, errorHandler);
      }
  );

  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "stato_tipo" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "nome" TEXT(100) NOT NULL);', [], nullDataHandler, errorHandler);
      }
  );

  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "peezs_cats" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "nome" TEXT(100) NOT NULL);', [], nullDataHandler, errorHandler);
      }
  );

  // Content networks
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "media_cdns" ("nome" TEXT(50) NOT NULL PRIMARY KEY);', [], nullDataHandler, errorHandler);
      }
  );

  // Tipo di media (foto, video, ecc...)
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "media_tipo" ("tipo" TEXT(50) NOT NULL PRIMARY KEY);', [], nullDataHandler, errorHandler);
      }
  );      
}   
/* ########## FINE TABELLE DI RIFERIMENTO PER FOREIGN KEYS ########## */ 