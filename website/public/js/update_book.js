/*
1 # Citation for the following page:
2 # Date: 3/18/2024
3 # Copied from /OR/ Adapted from /OR/ Based on 
4 # Everything here and through out the other pages are copied from the link below,
5 #   and just updated to work specifically with our own database.  Eventually we were able to 
6 #   to code everything with out help but it still followed the same basic format of the repository
7 # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/







// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("title_update");
    let inputAuthorID = document.getElementById("authorID_update");
    let inputISBN = document.getElementById("ISBN_update");
    let inputPublisherID = document.getElementById("publisherID_update")
    let inputID = document.getElementById("bookID_update")


    // Get the values from the form fields
    let idValue = inputID.value;
    let titleValue = inputTitle.value;
    let authorIDValue = inputAuthorID.value;
    let ISBNValue = inputISBN.value;
    let publisherIDValue = inputPublisherID.value;
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld



    // Put our data we want to send in a javascript object
    let data = {
        bookID: idValue,
        title: titleValue,
        authorID: authorIDValue,
        ISBN: ISBNValue,
        publisherID: publisherIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table

            updateRow(xhttp.response, idValue);
            
      

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, bookID){
    let parsedData = JSON.parse(data);

    
    let table = document.getElementById("books_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data_value") == bookID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td_title = updateRowIndex.getElementsByTagName("td")[1];
            let td_author = updateRowIndex.getElementsByTagName("td")[2];
            let td_ISBN = updateRowIndex.getElementsByTagName("td")[3];
            let td_publisher = updateRowIndex.getElementsByTagName("td")[4];
           

            // Reassign homeworld to our value we updated to
            console.log(parsedData[0])
            td_title.innerHTML = parsedData[0].title; 
            td_author.innerHTML = parsedData[0].authorID;
            td_ISBN.innerHTML = parsedData[0].ISBN;
            td_publisher.innerHTML = parsedData[0].publisherID;
       }
    }
}
