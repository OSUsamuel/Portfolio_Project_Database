
// Get the objects we need to modify
let updateBorrowingTransactionForm = document.getElementById('update-BorrowingTransaction-form-ajax');

// Modify the objects we need
updateBorrowingTransactionForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookID = document.getElementById("bookID_update");
    let inputMemberID = document.getElementById("memberID_update");
    let inputDateBorrowed = document.getElementById("dateBorrowed_update")
    let inputDateDue = document.getElementById("dateDue_update")
    let inputID = document.getElementById("transactionID_update")


    // Get the values from the form fields
    let idValue = inputID.value;
    let BookIDValue = inputBookID.value;
    let memberIDValue = inputMemberID.value;
    let dateBorrowedValue = inputDateBorrowed.value;
    let dateDueValue = inputDateDue.value;
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld



    // Put our data we want to send in a javascript object
    let data = {
        transactionID: idValue,
        bookID: BookIDValue,
        memberID: memberIDValue,
        dateBorrowed: dateBorrowedValue,
        dateDue: dateDueValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-BorrowingTransaction-ajax", true);
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


function updateRow(data, transactionID){
    let parsedData = JSON.parse(data);

    
    let table = document.getElementById("BorrowingTransaction_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data_value") == transactionID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td_bookID = updateRowIndex.getElementsByTagName("td")[1];
            let td_memberID = updateRowIndex.getElementsByTagName("td")[2];
            let td_dateBorrowed = updateRowIndex.getElementsByTagName("td")[3];
            let td_dateDue = updateRowIndex.getElementsByTagName("td")[4];
           

            // Reassign homeworld to our value we updated to
            console.log(parsedData[0])
            td_bookID.innerHTML = parsedData[0].bookID; 
            td_memberID.innerHTML = parsedData[0].memberID;
            td_dateBorrowed.innerHTML = parsedData[0].dateBorrowed;
            td_dateDue.innerHTML = parsedData[0].dateDue;
       }
    }
}
