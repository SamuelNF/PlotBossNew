function fill(crop, bed, plant, harvest, harvesting, name, planting, colour)
{
   var table = document.getElementById("table");
   var length = harvest-plant+1;
   console.log("Adding plant at "+bed+plant);

   var cell = table.rows[bed+1].cells[plant];
   cell.style.backgroundColor=colour;
   cell.setAttribute('colspan', length.toString());
   cell.innerHTML = '<button onclick="info('+crop+',\''+name+'\',\''+planting+'\',\''+harvesting+'\')"></button>';

   

/*  
   for(i=plant; i<= harvest; i++)
   {
      var cell = table.rows[bed+1].cells[i];
      cell.style.backgroundColor=colour;

      cell.innerHTML = '<button onclick="info('+crop+',\''+name+'\',\''+planting+'\',\''+harvesting+'\')"></button>';
      console.log(cell.innerHTML);
   }
*/
}

function info(crop, name, planting, harvesting)
{
   var info = document.getElementById("info");
   info.innerHTML =
   '<h2>'+name+'</h2>'+
   '<h3> Planting Tips </h3>'+
   '<p>'+planting+'<p/>'+
   '<h3> Harvesting Tips </h3>'+
   '<p>'+harvesting+'<p/>'+
   '<a href="plant?'+crop+'"> <i>Click here for the info page for this plant</i></a>';
}

function pad(name)
{
   var table = document.getElementById("table");
   console.log("Adding bed "+name);
   var newRow  = table.insertRow(table.rows.length);
   for (i = 0; i < 25; i++)
   { 
      var newCell  = newRow.insertCell(i);
   }
   newRow.cells[0].innerHTML = name;
}
   
//   cell.setAttribute('colspan', length.toString());

//   var newText  = document.createTextNode(name);
//   cell.appendChild(newText);

