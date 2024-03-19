/*
1 # Citation for the following page:
2 # Date: 3/18/2024
3 # Copied from /OR/ Adapted from /OR/ Based on 
4 # Everything here and through out the other pages are copied from the link below,
5 #   and just updated to work specifically with our own database.  Eventually we were able to 
6 #   to code everything with out help but it still followed the same basic format of the repository
7 # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/




function deleteAuthor(authorID)  {
    // Put our data we want to send in a javascript object
    let data = {
        id: authorID
    };
  
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
  
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
  
            // Add the new data to the table
            deleteRow(authorID);
  
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
  }
  
  
  function deleteRow(authorID){
  
    let table = document.getElementById("authors_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data_value") == authorID) {
            table.deleteRow(i);
            break;
        }
    }
  }