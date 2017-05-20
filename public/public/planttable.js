function fill(month, type)
{
   var table = document.getElementById("table");

   var cell = table.rows[type].cells[month+1];
   
   if(type==1)
   {
      cell.style.backgroundColor = 'blue';
   }
   else
   {
      cell.style.backgroundColor = 'red';
   }      
}

function pad()
{
   var table = document.getElementById("table");
   var newRow  = table.insertRow(table.rows.length);
   for (i = 0; i < 12; i++)
   {
      var newCell  = newRow.insertCell(i);
   }
   newRow.cells[0].innerHTML = 'Planting Months';
   var newRow  = table.insertRow(table.rows.length);
   for (i = 0; i < 12; i++)
   { 
      var newCell  = newRow.insertCell(i);
   }
   newRow.cells[0].innerHTML = 'Harvest Months';
}
