var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('plotboss');

var name = "Fern";
var season = "Summer";

db.serialize(function()
{
   db.run("DROP TABLE IF EXISTS Plants");
   db.run("CREATE TABLE Plants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, plant TEXT, harvest TEXT)");

   var stmt = db.prepare("INSERT INTO Plants (name, plant, harvest) VALUES (?,?,?)");
   stmt.run("Cherry", "Winter", "Summer");
   stmt.run("Peach", "Autumn", "Summer");
   stmt.run("Turnip", "Spring", "Autumn");
   stmt.finalize();

   db.each("SELECT * FROM Plants", 
      function(err, row)
      {
         console.log(row);
      }
   );
});

db.close();
