
/**************************************************************************************************************
Select queries
**************************************************************************************************************/
-- Gets all Member information --
SELECT memberID, CONCAT(firstName ,  " ", lastName  ) as name, email from Members;

-- Gets all Book information --
Select bookID, title, ISBN, publisherID from Books;

-- Gets Author information --
Select authorID, firstName, lastName from Authors;

-- Gets Borrowing Transactions information --
Select transactionID, dateBorrowed, dateDue, bookID, memberID from BorrowingTransactions;

-- Gets Publisher information --
Select publisherID, name, website from Publishers;

-- Selects book with filter --
Select title, author, ISBN from Books
where title = ":title_input";

-- Gets transaction information on tables --
Select transactionID, dateBorrowed, dateDue, title, first_name and last_name as Author, member from BorrowingTransactions
INNER JOIN Members ON BorrowingTransactions.memberID=Members.memberID
INNER JOIN Books ON BorrowingTransactions.bookID = Books.bookID
INNER JOIN Authors ON Books.authorID = Author.authorID;

/**************************************************************************************************************
Insert queries for "Add New"
**************************************************************************************************************/
-- Adds new member --
INSERT INTO Members (firstName, lastName, email)
VALUES (:first_name_input, :last_name_input, :email_input);

-- Adds new Book --
INSERT INTO Books (title, ISBN, publisherID)
VALUES (:title_input, :ISBN_input,(SELECT publisherID from Publishers WHERE name = :name_input));

-- Adds new Author
INSERT INTO Authors (firstName, lastName)
VALUES (:firstName_input, :lastName_input);

-- Adds new Borrowing Transactions

-- Adds new publisher --
INSERT INTO Publishers (name, website)
VALUES (:name_input, :website_input);

-- Maps books to authors
INSERT INTO BookAuthors (bookID, authorID)
VALUES((SELECT bookID FROM Books WHERE bookID=:bookID_input), (SELECT authorID FROM Authors WHERE authorID= :AuthorID_input));

/**************************************************************************************************************
Delete Queries
**************************************************************************************************************/
-- Delete Member -- 
Delete FROM BorrowingTransactions where BorrowingTransactions.memberID = :memberID_input;
DELETE FROM Members where MemberID = :memberID_input;

-- Delete Book -- 
DELETE FROM Books WHERE (ISBN = :ISBN_input);
DELETE FROM BookAuthors 
    WHERE
        bookID = (SELECT bookID FROM Books WHERE (ISBN = :ISBN_input));

-- Delete Borrowing Transactions --
    
-- Delete Publisher --
DELETE FROM Publishers WHERE (name = :name_input);

/**************************************************************************************************************
Update Queries
**************************************************************************************************************/
-- Update member --
UPDATE Members
SET   firstName = :first_name_input, last_name = :last_name_input, email = :email_input
WHERE (memberID = :id_input);

-- Update Books -- 
UPDATE Books
SET title = ':new_title'
WHERE bookID = :book_id;

-- Update Authors --
Update Authors
SET   firstName = :first_name_input, last_name = :last_name_input
WHERE (firstName = :firstName_input) and (lastName = lastName_input);

-- Update Borrowing Transactions --


-- Update Publishers --
UPDATE Publishers
SET  name = :name_input, website = :website_input
WHERE (name = :name_input) and (:website = :website_input)

