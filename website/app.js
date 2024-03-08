// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9199;                 // Set a port number at the top so it's easy to change in the future


const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');      

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
 
// app.js


// Database
var db = require('./database/db-connector')


app.set('view engine', 'hbs');


// app.js - ROUTES section
app.get('/', function(req, res)
{

   
    if (req.query.lastName === undefined)
    {
        query1 = "SELECT memberID, CONCAT(firstName ,  \" \", lastName  ) as name, email from Members;";
    } else 
    {
        query1 = `SELECT memberID, CONCAT(firstName ,  \" \", lastName  ) as name, email from Members WHERE lastName LIKE "${req.query.lastName}%"`
    }
   

    db.pool.query(query1, function(error, rows, fields){
        res.render('index', {data: rows});
    })
});


app.get('/books', function(req, res)
{

    query1 = "SELECT * from Books;";
    query2 = "SELECT authorID, CONCAT(firstName ,  \" \", lastName  ) as name from Authors;";
    query3 = "SELECT * from Publishers;"
    

    db.pool.query(query1, function(error, rows, fields){
        let books = rows;

        db.pool.query(query2, function(error, rows, fields){
            let authors = rows;

            db.pool.query(query3, function(error, rows, fields){
                let publishers = rows;
                res.render('books_page', {data: books, authors: authors, publishers: publishers});
        })
        
    })
});

});


app.get('/borrowing_transactions', function(req, res){

    query1 = "SELECT * from BorrowingTransactions;"
    db.pool.query(query1, function(error, rows, fields){
        res.render('BorrowingTransactions_page', {data: rows});
    })
    



});

app.get('/authors', function(req,res){
    
    query1 = "SELECT authorID, CONCAT(firstName ,  \" \", lastName) as name from Authors;";
    

    db.pool.query(query1, function(error, rows, fields){
        res.render('authors_page', {data: rows});
    })
});


app.get('/publishers', function(req,res){
    query1 = "SELECT * from Publishers;"
    db.pool.query(query1, function(error, rows, fields){
        res.render('publishers_page', {data: rows});
    })
   
});





app.post('/add-author-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values


    // Create the query and run it on the database
    query1 = `INSERT INTO Authors (firstName, lastName) VALUES ('${data.firstName}', '${data.lastName}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          
            query2 = `SELECT authorID, CONCAT(firstName ,  \" \", lastName  ) as name from Authors;`
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
}); 



app.post('/add-member-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values


    // Create the query and run it on the database
    query1 = `INSERT INTO Members (firstName, lastName, email) VALUES ('${data.firstName}', '${data.lastName}','${data.email}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          
            query2 = `SELECT memberID, CONCAT(firstName ,  \" \", lastName  ) as name, email from Members;`
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
}); 




app.post('/add-book-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values


    // Create the query and run it on the database
    query1 = `INSERT INTO Books (title, authorID, ISBN, publisherID) VALUES ('${data.title}', '${data.authorID}', '${data.ISBN}', '${data.publisherID}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          
            query2 = `SELECT * from Books;`
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
}); 



app.delete('/delete-book-ajax/', function(req,res,next){
    let data = req.body;
    let bookID = parseInt(data.id);
    let deleteBook = `DELETE FROM Books where bookID = '${data.id}';`;
    let deleteBookAuthors = `Delete FROM BookAuthors where BookAuthors.bookID = '${data.id}';`;
  
  
          // Run the 1st query
          db.pool.query(deleteBookAuthors, [bookID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteBook, [bookID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});



app.delete('/delete-member-ajax/', function(req,res,next){
    let data = req.body;
    let memberID = parseInt(data.id);
    let deleteMember = `DELETE FROM Members where MemberID = '${data.id}'`
    let deleteBorrowingTransactions= `Delete FROM BorrowingTransactions where BorrowingTransactions.memberID = '${data.id}';`
  
  
          // Run the 1st query
          db.pool.query(deleteBorrowingTransactions, [memberID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteMember, [memberID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});


  app.put('/put-member-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
  
    let memberID = parseInt(data.memberID)
 
    console.log(data.firstName)
    let queryUpdateMember = `UPDATE Members SET firstName = '${data.firstName}', lastName = '${data.lastName}', email = '${data.email}' WHERE (memberID = '${memberID}');`
    let selectMembers = `select memberID, CONCAT('${data.firstName}' ,  \" \", '${data.lastName}'  ) as name, email from Members where (memberID = '${memberID}')`
          // Run the 1st query
          db.pool.query(queryUpdateMember, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }  else
              {
                  // Run the second query
                  db.pool.query(selectMembers, function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          console.log(rows)
                          res.send(rows);
                      }
                  })
              }
  })});

  

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

