var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test');

var name = "Fern";
var season = "Summer";
/*
db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");
 
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();
 
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});
 
db.close();
*/
db.serialize(function()
{
   db.run("DROP TABLE IF EXISTS Crab");
   db.run("DROP TABLE IF EXISTS Plants");
   db.run("CREATE TABLE Plants (name TEXT, season TEXT)");

   var stmt = db.prepare("INSERT INTO Plants VALUES (?,?)");
   stmt.run(name, season);
   stmt.finalize();

   db.each("SELECT * FROM Plants", 
      function(err, row)
      {
         console.log(row);
      }
   );
});
