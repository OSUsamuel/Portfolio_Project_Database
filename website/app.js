/*
1 # Citation for the following page:
2 # Date: 3/18/2024
3 # Copied from /OR/ Adapted from /OR/ Based on 
4 # Everything here and through out the other pages are copied from the link below,
5 #   and just updated to work specifically with our own database.  Eventually we were able to 
6 #   to code everything with out help but it still followed the same basic format of the repository
7 # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


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

app.get('/', function(req, res){

    res.render('index', {cssType: "index"});
})


// app.js - ROUTES section
app.get('/members', function(req, res)
{
    let getMembers = `Select memberID from Members`
   
    if (req.query.lastName === undefined)
    {
        query1 = "SELECT memberID, CONCAT(firstName ,  \" \", lastName  ) as name, email from Members;";
    } else 
    {
        query1 = `SELECT memberID, CONCAT(firstName ,  \" \", lastName  ) as name, email from Members WHERE lastName LIKE "${req.query.lastName}%"`
    }
   

    db.pool.query(query1, function(error, rows, fields){
        let members = rows
        db.pool.query(getMembers, function(error, rows, fields){
            res.render('members_page', {data: members, memberIDs: rows, cssType: "members"});
        })

    })
});


app.get('/books', function(req, res)
{

    query1 = "SELECT * from Books;";
    getBookIDs = "Select bookID from Books;"
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
                    db.pool.query(getBookIDs, function(error, rows, fields){
                        let bookIDs = rows;


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

            
            
            console.log(books.bookID)
            res.render('books_page', {data: books,authors: authors, publishers: publishers, bookIDs: bookIDs, cssType: "books"});
        })
    })
        
    })
});

});


app.get('/borrowing_transactions', function(req, res){

    query1 = "SELECT * from BorrowingTransactions;"
    query2 = "Select * from Books;"
    query3 = "SELECT memberID, CONCAT(firstName ,  \" \", lastName  ) as name from Members;"
    getTransactionIDs = "Select transactionID from BorrowingTransactions;"



    db.pool.query(query1, function(error, rows, fields){
            transactions = rows;
        db.pool.query(query2, function(error, row, fields){
                books = row;
               
            db.pool.query(query3, function(error, row, fields){
                members = row;
                db.pool.query(getTransactionIDs, function(error, rows, fields){
                    let transactionIDs = rows;
                

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


                res.render('BorrowingTransactions_page', {data: transactions, books: books, members: members, transactionIDs: transactionIDs});

            })
        })
        
    })
    

    })

});

app.get('/authors', function(req,res){
    
    query1 = "SELECT authorID, CONCAT(firstName ,  \" \", lastName) as name from Authors;";
    

    db.pool.query(query1, function(error, rows, fields){
        res.render('authors_page', {data: rows, cssType: "authors"});
    })
});


app.get('/publishers', function(req,res){
    query1 = "SELECT * from Publishers;"
    db.pool.query(query1, function(error, rows, fields){
        res.render('publishers_page', {data: rows, cssType: "publishers"});
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
    console.log(data)
    console.log(publisherID)
    if (isNaN(publisherID))
    {     
        data.publisherID = null;
    }


    // Create the query and run it on the database
    query1 = `INSERT INTO Books (title, authorID, ISBN, publisherID) VALUES ('${data.title}', ${data.authorID}, '${data.ISBN}', ${data.publisherID});`;
    let getPublisherName = `select name from Publishers where (publisherID = '${data.publisherID}');`
    let getAuthorName = `select CONCAT(firstName ,  \" \", lastName) as name from Authors where (authorID = '${data.authorID}')`  
    
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
                    let books = rows
                
                     db.pool.query(getPublisherName, function(error, rows, fields) {
                         let publisher = rows;
                        db.pool.query(getAuthorName, function(error, rows, fields){
                            let author = rows;

                    
                    if(publisher[0] == undefined){
                    books = books.map(book => {
                        return Object.assign(book, {authorID: author[0].name})           
                    })
                    } else {
                    books = books.map(book => {
                        return Object.assign(book, {publisherID: publisher[0].name, authorID: author[0].name})           
                    })
                }

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
  
                    res.send(books);
                }
            })
            })
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
    query2 = `SELECT * from BorrowingTransactions;`
    query3 = "Select * from Books;"
    query4 = "SELECT memberID, CONCAT(firstName ,  \" \", lastName  ) as name from Members;"
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          
            db.pool.query(query2, function(error, rows, fields){
                let transactions = rows;
                db.pool.query(query3, function(error, row, fields){
                    books = row;
                   
                db.pool.query(query4, function(error, row, fields){
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
        })
    })
        }
    })
}); 












app.delete('/delete-book-ajax/', function(req,res,next){
    let data = req.body;
    let bookID = parseInt(data.id);
    let deleteBook = `DELETE FROM Books where bookID = '${data.id}';`;
    let deleteBorrowingTransactions = `Delete FROM BorrowingTransactions where BorrowingTransactions.bookID = '${data.id}';`;
  
  
          // Run the 1st query
          db.pool.query(deleteBorrowingTransactions, [bookID], function(error, rows, fields){
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
    let setPublisherNull = `UPDATE Books SET publisherID = null WHERE (publisherID = '${data.id}');`;
  
  
          // Run the 1st query
          db.pool.query(setPublisherNull, function(error, rows, fields){
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
    

    if (isNaN(parseInt(data.publisherID)))
    {     
        data.publisherID = null;
    }
    
 
    let queryUpdateBook = `UPDATE Books SET title = '${data.title}', authorID = '${data.authorID}', ISBN = '${data.ISBN}', publisherID = ${data.publisherID} WHERE (bookID = '${bookID}');`
    let selectBooks = `select * from Books where (bookID = '${bookID}')`
    let getPublisherName = `select name from Publishers where (publisherID = '${data.publisherID}');`
    let getAuthorName = `select CONCAT(firstName ,  \" \", lastName) as name from Authors where (authorID = '${data.authorID}')`   
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
                    let books = rows;
                    
                    db.pool.query(getPublisherName, function(error, rows, fields) {
                        let publisher = rows;
                        db.pool.query(getAuthorName, function(error, rows, fields){
                            let author = rows;

                    

                    if(publisher[0] == undefined){
                        books = books.map(book => {
                            return Object.assign(book, {authorID: author[0].name})           
                        })
                    }else {
                    books = books.map(book => {
                        return Object.assign(book, {publisherID: publisher[0].name, authorID: author[0].name})           
                    })
                }

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          console.log(books)
                          res.send(books);
                      }
                  })
                })
            })
              }
  })});





  app.put('/put-BorrowingTransaction-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
  
    let transactionID = parseInt(data.transactionID)
    


    
    let queryUpdateBorrowingTransaction = `UPDATE BorrowingTransactions SET bookID = '${data.bookID}', memberID = '${data.memberID}', dateBorrowed = '${data.dateBorrowed}', dateDue = '${data.dateDue}' WHERE (transactionID = '${transactionID}');`
    let selectTransactions = `select * from BorrowingTransactions where (transactionID = '${transactionID}');`
    let getBookTitle = `select * from Books where (bookID = '${data.bookID}');`
    let getMemberName = `select CONCAT(firstName ,  \" \", lastName) as name from Members where (memberID = '${data.memberID}');`   
        // Run the 1st query
          db.pool.query(queryUpdateBorrowingTransaction, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }  else
              {
                  // Run the second query
                  db.pool.query(selectTransactions, function(error, rows, fields) {
                    let transactions = rows;
                    
                    db.pool.query(getBookTitle, function(error, rows, fields) {
                        let book = rows;
                        console.log(book);
                          
                        db.pool.query(getMemberName, function(error, rows, fields){
                            let member = rows;

                    
                    transactions = transactions.map(transaction => {
                        return Object.assign(transaction, {bookID: book[0].title, memberID: member[0].name})           
                    })

                

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          console.log(transactions)
                          res.send(transactions);
                      }
                  })
                })
            })
              }
  })});

  

  

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

