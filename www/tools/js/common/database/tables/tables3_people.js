/* ########## INIZIO PEOPLES ########## */
function create_People_Tables(db)
{
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "peoples_stato" ("stato" TEXT(50) NOT NULL PRIMARY KEY);', [], nullDataHandler, errorHandler);
      }
  );

  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "peoples" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "stato" TEXT(50) NOT NULL DEFAULT "profile_completation_stadio_1", "token" TEXT(50) NOT NULL, "pw" TEXT(50) NOT NULL DEFAULT "", "titolo" TEXT(100) NULL DEFAULT "", "nome" TEXT(100) NULL DEFAULT "", "cognome" TEXT(100) NULL DEFAULT "", "nick" TEXT(100) NULL DEFAULT "", "nato_on" DATE NULL DEFAULT NULL, "created_on" DATETIME NOT NULL, "updated_on" DATETIME NOT NULL, "access_on" DATETIME NULL DEFAULT NULL, "LS_ip" INTEGER NULL DEFAULT "0", "LS_on" DATETIME NULL DEFAULT NULL, CONSTRAINT "FK_people_stato" FOREIGN KEY ("stato") REFERENCES "peoples_stato" ("stato") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "token" UNIQUE (token ASC), CONSTRAINT "alias" UNIQUE (nick ASC));', [], nullDataHandler, errorHandler);
      }
  );

  // Indice della peoples.
  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE INDEX IF NOT EXISTS "stato" ON "peoples" ("stato" ASC);', [], nullDataHandler, errorHandler);
      }
  );

  db.transaction(
      function (transaction) 
      {
          transaction.executeSql('CREATE TABLE IF NOT EXISTS "peoples_titolo" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "titolo" TEXT(20) NOT NULL);', [], nullDataHandler, errorHandler);
      }
  );
}
/* ########## FINE PEOPLES ########## */