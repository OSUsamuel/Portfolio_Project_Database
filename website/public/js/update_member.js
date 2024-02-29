
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-member-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLastName = document.getElementById("lastName_update");
    let inputFirstName = document.getElementById("firstName_update");
    let inputEmail = document.getElementById("email_update");
    let inputID = document.getElementById("memberID_update")


    // Get the values from the form fields
    let idValue = inputID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld



    // Put our data we want to send in a javascript object
    let data = {
        memberID: idValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-member-ajax", true);
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


function updateRow(data, memberID){
    let parsedData = JSON.parse(data);

    
    let table = document.getElementById("members_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data_value") == memberID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td_name = updateRowIndex.getElementsByTagName("td")[1];
            let td_email = updateRowIndex.getElementsByTagName("td")[2];
           

            // Reassign homeworld to our value we updated to
            console.log(parsedData[0])
            td_name.innerHTML = parsedData[0].name; 
            td_email.innerHTML = parsedData[0].email;
       }
    }
}
