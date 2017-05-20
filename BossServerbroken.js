// Run a node.js web server for local development of a static web site.
// Start with "node server.js" and put pages in a "public" sub-folder.
// Visit the site at the address printed on the console.

// The server is configured to be platform independent.  URLs are made lower
// case, so the server is case insensitive even on Linux, and paths containing
// upper case letters are banned so that the file system is treated as case
// sensitive even on Windows.

// Load the library modules, and define the global constants.
// See http://en.wikipedia.org/wiki/List_of_HTTP_status_codes.
// Start the server: change the port to the default 80, if there are no
// privilege issues and port number 80 isn't already in use.

var http = require("http");
var fs = require("fs");
var bar = require("handlebars");
var QS = require("querystring");
var OK = 200, NotFound = 404, BadType = 415, Error = 500;
var types, banned;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('plotboss.db');
start(8080);

// Start the http service.  Accept only requests from localhost, for security.
function start(port)
{
   types = defineTypes();
   banned = [];
   banUpperCase("./public/", "");
   var service = http.createServer(handle);
   service.listen(port, "localhost");
   var address = "http://localhost";
   if (port != 80) address = address + ":" + port;
   console.log("Server running at", address);
}

// Serve a request by delivering a file.
function handle(request, response) 
{
   console.log("URL requested: ",request.url," (Length: ",request.url.length,")");
   var url = request.url.toLowerCase();
   var type = findType(url);

   if(request.url.includes("?"))
   {
      var template = url.split("?")[0];
      var id = url.split("?")[1];
   }else template = url;


 //deal with post request (for  page)
   request.on('data', add);
   request.on('end', end);
   var body = "";
   console.log("in post stuff.");
   function add(chunk) {
      body = body + chunk.toString();
   }
   function end() {
      console.log("Body:", body);
      if(body){
        (response, body);
         console.log("body exists");
      }
   }

   // if the url is empty
   if(request.url.length<2)
   {
      loginPage(response);
      console.log("---login page delivered");
   }

   // if a specific file is requested via url
   else if (type != null)
   {
      var file = "./public" + url;
      fs.readFile(file, ready);
      function ready(err, content) { deliver(response, type, err, content); }
      console.log("---file delivered");
   }
   
   // if a template page is requested
   else if (template != null)
   {
      if(template=="/plant") plant(response, id);
      if(template=="/plantindex") plantIndex(response);
      if(template=="/home") home(response, id);
   }

   // if all else fails
   else
   {
      fail(response, Error, "URL invalid");
   }
}

function loginPage(response)
{
   var file = "public/index.html";
   fs.readFile(file, ready);
   function ready(err, content) { deliver(response, "html", err, content); }
}

// Injects User's plot data into home page template and delivers
function home(response,id)
{
   var source = fs.readFileSync("public/home.html", "utf8");
   var template = bar.compile(source);
   var bedNum;
   var stmt1 = (
//   "SELECT COUNT(*) AS count FROM Bed "+

   "SELECT * FROM Bed "+
   "WHERE Bed.owner = ? "+
   "ORDER BY Bed.id DESC");

   var stmt2 = (
   "SELECT * FROM ( "
   +"   SELECT *, Crop.name AS cropName, Bed.id AS bedID "
   +"   FROM PlotCrop "
   +"   JOIN Crop ON PlotCrop.crop = Crop.id " 
   +"   JOIN Bed ON PlotCrop.bed = bedID "
   +"   WHERE Bed.owner = ?) d "
   +"JOIN ( "
   +"   SELECT b.id AS bedID, (SELECT COUNT(*) "
   +"   FROM Bed a WHERE a.owner = ? "
   +"   AND a.id>=b.id) AS bedIndex "
   +"   FROM Bed b "
   +"   WHERE b.owner = ? "
   +") c "
   +"ON d.bedID = c.bedID "
   +"ORDER BY plant ASC");

   db.serialize(function()
   {
      var cropArray = [];
      var bedArray = [];

      db.all(stmt1, id, function(err,rows)
      {
         rows.forEach(function (row)
         {
            var temp = {name: row.name};
            bedArray.push(temp);
            console.log(temp);
         })
      });

      db.all(stmt2,id,id,id, function(err,rows)
      {
         rows.forEach(function (row)
         {
         var temp = {
            crop:row.crop,
            plant:row.plant,
            harvest:row.harvest,
            bed:row.bedIndex,
            harvesting:row.harvesting,
            name:row.cropName,
            planting:row.planting,
            colour:row.colour
         };
         cropArray.push(temp);
         console.log(temp);
         })
         var html = template({croplist: cropArray, bedlist: bedArray});
         response.writeHead(200,{ 'Content-Type': 'text/html'});
         response.write(html);
         response.end();
      });
   });
}

// Injects Plant data from database into template and delivers page
function plant(response, id)
{
   var plantList = [];
   var harvestList = [];
   var source = fs.readFileSync("public/plant.html", "utf8");
   var template = bar.compile(source);
   db.serialize(function()
   {
      var stmtPlant = ("SELECT * FROM Planted WHERE crop = ?");
      db.all(stmtPlant, id, function(err,rows)
      {
         rows.forEach(function (row)
         {
            var temp = {plantMonth: row.month};
            plantList.push(temp);
         });
      });

      var stmtHarvest = ("SELECT * FROM Harvested WHERE crop = ?");
      db.all(stmtHarvest, id, function(err,rows)
      {
         rows.forEach(function (row)
         {
            var temp = {harvestMonth : row.month};
            harvestList.push(temp);
         });
      });

      var stmtCrop = ("SELECT * FROM Crop WHERE id = ?");
      db.get(stmtCrop, id, function(err,row)
      {
         var html = template({name: row.name, plant: row.plant, harvest: row.harvest,
                    planting: row.planting, location: row.location,
                    harvesting: row.harvesting, plantlist: plantList, harvestlist: harvestList});
         response.writeHead(200,{ 'Content-Type': 'text/html' });
         response.write(html);
         response.end();
      });
   });
}

// Creates and delivers plant index page
function plantIndex(response, id)
{
   console.log("in plant index\n");
   //create list of plantnames from database
   var array = [];
   var source = fs.readFileSync("public/plantindex.html", "utf8");
   var template = bar.compile(source);
   db.all("SELECT id, name FROM Crop", function(err, rows) 
   {  
      rows.forEach(function (row) 
      { 
         //add to end of array 
         var temp = {name: row.name, url: "plant?" +row.id};
         array.push(temp); 
      })
      console.log("ARRAY --" + array);
      var html = template({plantlist: array});
      response.writeHead(200,{ 'Content-Type': 'text/html'});
      response.write(html);
      response.end();
   });
}


function register(response, body)
{
   //get info from url
   var array = body.split("&");
   var temp = array[0].split("=");
   var username = temp[1];
   temp = array[1].split("=");
   var password = temp[1];
   temp = array[2].split("=");
   var password2 = temp[1];

   //need to add checks that passwords match and fields aren't empty, username doen'st already exist
   //if there is an error, reload the register page with an error message handlebarsed in
   /*var stmt1 = ("SELECT COUNT(*) FROM Person WHERE username = ?;");
   db.get(stmt1, username);
   if(count != 0){
      //error 
   8}*/ 

   // add to database
   var stmt = ("INSERT INTO Person (username, password) VALUES (?,?);");
   db.run(stmt, username, password);

   //deliver page - take you to home page but logged in
   console.log("username: " + username);
   //home(response,username);
   home(response,"1");
   
}


// Forbid any resources which shouldn't be delivered to the browser.
function isBanned(url)
{
   for (var i=0; i<banned.length; i++) 
   {
      var b = banned[i];
      if (url.startsWith(b)) return true;
   }
   return false;
}

// Find the content type to respond with, or undefined.
function findType(url)
{
   var dot = url.lastIndexOf(".");
   var extension = url.substring(dot + 1);
   return types[extension];
}

// Deliver the file that has been read in to the browser.
function deliver(response, type, err, content)
{
   if (err) return fail(response, NotFound, "File not found");
   var typeHeader = { "Content-Type": type };
   response.writeHead(OK, typeHeader);
   response.write(content);
   response.end();
}

// Give a minimal failure response to the browser
function fail(response, code, text)
{
   var textTypeHeader = { "Content-Type": "text/plain" };
   response.writeHead(code, textTypeHeader);
   response.write(text, "utf8");
   response.end();
}

// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) 
{
   var folderBit = 1 << 14;
   var names = fs.readdirSync(root + folder);
   for (var i=0; i<names.length; i++)
   {
      var name = names[i];
      var file = folder + "/" + name;
      if (name != name.toLowerCase()) banned.push(file.toLowerCase());
      var mode = fs.statSync(root + file).mode;
      if ((mode & folderBit) == 0) continue;
      banUpperCase(root, file);
   }
}

// The most common standard file extensions are supported, and html is
// delivered as xhtml ("application/xhtml+xml").  Some common non-standard file
// extensions are explicitly excluded.  This table is defined using a function
// rather than just a global variable, because otherwise the table would have
// to appear before calling start().  NOTE: for a more complete list, install
// the mime module and adapt the list it provides.
function defineTypes() 
{
   var types = {
      html : "application/xhtml+xml",
      css  : "text/css",
      js   : "application/javascript",
      png  : "image/png",
      gif  : "image/gif",    // for images copied unchanged
      jpeg : "image/jpeg",   // for images copied unchanged
      jpg  : "image/jpeg",   // for images copied unchanged
      svg  : "image/svg+xml",
      json : "application/json",
      pdf  : "application/pdf",
      txt  : "text/plain",
      ttf  : "application/x-font-ttf",
      woff : "application/font-woff",
      aac  : "audio/aac",
      mp3  : "audio/mpeg",
      mp4  : "video/mp4",
      webm : "video/webm",
      ico  : "image/x-icon", // just for favicon.ico
      xhtml: undefined,      // non-standard, use .html
      htm  : undefined,      // non-standard, use .html
      rar  : undefined,      // non-standard, platform dependent, use .zip
      doc  : undefined,      // non-standard, platform dependent, use .pdf
      docx : undefined,      // non-standard, platform dependent, use .pdf
   }
   return types;
}
