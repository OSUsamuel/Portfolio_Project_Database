// Get the objects we need to modify
let addBookForm = document.getElementById('addBookFormAjax');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("title_input");
    let inputAuthorID = document.getElementById("authorID_input")
    let inputISBN = document.getElementById("ISBN_input");
    let inputPublisherID = document.getElementById("publisherID_input")
  

    // Get the values from the form fields
    let titleValue = inputTitle.value;
    let authorValue = inputAuthorID.value;
    let ISBNValue = inputISBN.value;
    let publisherValue = inputPublisherID.value;

   


    // Put our data we want to send in a javascript object
    let data = {
        title: titleValue,
        authorID: authorValue,
        ISBN: ISBNValue,
        publisherID: publisherValue

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTitle.value = '';
            inputAuthorID.value = '';
            inputISBN.value = '';
            inputPublisherID.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input. oh darn")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("books_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let authorIDCell = document.createElement("TD");
    let ISBNCell = document.createElement("TD");
    let publisherIDCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");
    

    // Fill the cells with correct data
    idCell.innerText = newRow.bookID;
    titleCell.innerText = newRow.title;
    authorIDCell.innerText = newRow.authorID;
    ISBNCell.innerText = newRow.ISBN;
    publisherIDCell.innerText = newRow.publisherID;


    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBook(newRow.id);
    };



    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(authorIDCell);
    row.appendChild(ISBNCell);
    row.appendChild(publisherIDCell);
    row.appendChild(deleteCell);



    row.setAttribute('data_value', newRow.id);

    
    // Add the row to the table
    currentTable.appendChild(row);



 
}