// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9221;                 // Set a port number at the top so it's easy to change in the future


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
            // Save the planets
            let authors = rows; 

            // BEGINNING OF NEW CODE
           
            db.pool.query(query3, function(error, rows, fields){
                let publishers = rows;

            
            let publishermap = {}
            publishers.map(publisher => {
                let id = parseInt(publisher.publisherID, 10);
                publishermap[id] = publisher["name"];
               
            })

            books = books.map(book => {
                return Object.assign(book, {publisherID: publishermap[book.publisherID]})
                
            })

            
            
            let authormap = {}
            authors.map(author => {
                let id = parseInt(author.authorID, 10);
                authormap[id] = author["name"];
               
            })

            books = books.map(book => {
                return Object.assign(book, {authorID: authormap[book.authorID]})
                
            })

            

   
            res.render('books_page', {data: books,authors: authors, publishers: publishers});
        })
        
    })
});

});


app.get('/borrowing_transactions', function(req, res){

    query1 = "SELECT * from BorrowingTransactions;"
    query2 = "Select * from Books;"
    query3 = "SELECT memberID, CONCAT(firstName ,  \" \", lastName  ) as name from Members;"


    db.pool.query(query1, function(error, rows, fields){
            transactions = rows;
        db.pool.query(query2, function(error, row, fields){
                books = row;
               
            db.pool.query(query3, function(error, row, fields){
                members = row;
                

                let booksmap = {}
                books.map(book => {
                    let id = parseInt(book.bookID, 10);
                    booksmap[id] = book["title"];
                   
                })
    
                transactions = transactions.map(transaction => {
                    return Object.assign(transaction, {bookID: booksmap[transaction.bookID]})
                    
                })

                
                let membersmap = {}
                members.map(member => {
                    let id = parseInt(member.memberID, 10);
                    membersmap[id] = member["name"];
                   
                })
    
                transactions = transactions.map(transaction => {
                    return Object.assign(transaction, {memberID: membersmap[transaction.memberID]})
                    
                })


                res.render('BorrowingTransactions_page', {data: transactions, books: books, members: members});

            })
        })
        
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
    
    let publisherID = parseInt(data.publisherID);
    console.log(publisherID)
    if (isNaN(publisherID))
    {
        data.publisherID = NULL
    }
    console.log(data.publisherID)


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




app.post('/add-publisher-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values


    // Create the query and run it on the database
    query1 = `INSERT INTO Publishers(name, website) VALUES ('${data.name}', '${data.website}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          
            query2 = `SELECT * from Publishers;`
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
                    console.log(rows)
                    res.send(rows);
                }
            })
        }
    })
}); 




app.post('/add-borrowingTransaction-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values


    // Create the query and run it on the database
    query1 = `INSERT INTO BorrowingTransactions (bookID, memberID, dateBorrowed, dateDue) VALUES ('${data.bookID}', '${data.memberID}', '${data.dateBorrowed}', '${data.dateDue}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          
            query2 = `SELECT * from BorrowingTransactions;`
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
                    console.log(rows)
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





  app.delete('/delete-author-ajax/', function(req,res,next){
    let data = req.body;
    let authorID = parseInt(data.id);
    let deleteAuthor = `DELETE FROM Authors where authorID = '${data.id}';`;
    let deleteBookAuthors = `Delete FROM BookAuthors where BookAuthors.authorID = '${data.id}';`;
  
  
          // Run the 1st query
          db.pool.query(deleteBookAuthors, [authorID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteAuthor, [authorID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});



  app.delete('/delete-publisher-ajax/', function(req,res,next){
    let data = req.body;
    let publisherID = parseInt(data.id);
    let deletePublisher = `DELETE FROM Publishers where publisherID = '${data.id}';`;
    let deleteBook = `Delete FROM Books where Books.publisherID = '${data.id}';`;
  
  
          // Run the 1st query
          db.pool.query(deleteBook, [publisherID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deletePublisher, [publisherID], function(error, rows, fields) {
  
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


  app.delete('/delete-BorrowingTransaction-ajax/', function(req,res,next){
    let data = req.body;
    let transactionID = parseInt(data.id);
    let deleteBorrowingTransaction = `DELETE FROM BorrowingTransactions where transactionID = '${data.id}';`;  

    db.pool.query(deleteBorrowingTransaction, [transactionID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
              
  });











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



  app.put('/put-book-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
  
    let bookID = parseInt(data.bookID)
    console.log(data)
 
    let queryUpdateBook = `UPDATE Books SET title = '${data.title}', authorID = '${data.authorID}', ISBN = '${data.ISBN}', publisherID = '${data.publisherID}' WHERE (bookID = '${bookID}');`
    let selectBooks = `select * from Books where (bookID = '${bookID}')`
          // Run the 1st query
          db.pool.query(queryUpdateBook, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }  else
              {
                  // Run the second query
                  db.pool.query(selectBooks, function(error, rows, fields) {
  
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

