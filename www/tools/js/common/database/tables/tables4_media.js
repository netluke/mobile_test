/* ########## INIZIO MEDIA ########## */
function create_Media_Tables(db)
{

  // File fisici, connessi ai media.
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "media_files" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "tipo" TEXT(50) NOT NULL DEFAULT "image", "cdn" TEXT(50) NOT NULL DEFAULT "local", "width" INTEGER DEFAULT 0, "height" INTEGER DEFAULT 0, "file" TEXT(50) DEFAULT NULL, "created_on" DATETIME DEFAULT NULL, FOREIGN KEY ("cdn") REFERENCES "media_cdns" ("nome") ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY ("tipo") REFERENCES "media_tipo" ("tipo") ON DELETE CASCADE ON UPDATE CASCADE);', [], nullDataHandler, errorHandler);
      }
  );

  // Indice1 della media_files.
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE INDEX IF NOT EXISTS "cdn" ON "media_files" ("cdn" ASC);', [], nullDataHandler, errorHandler);
      }
  );

  // Indice2 della media_files.
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE INDEX IF NOT EXISTS "tipo" ON "media_files" ("tipo" ASC);', [], nullDataHandler, errorHandler);
      }
  );

}
/* ########## FINE MEDIA ########## */