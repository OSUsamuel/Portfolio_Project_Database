


-- Gets all member information --
SELECT memberID, CONCAT(firstName ,  " ", lastName  ) as name, email from Members;


-- Gets all book information --
Select bookID, title, ISBN, publisherID from Books;


-- Gets Author information --
Select authorID, firstName, lastName from Authors;

-- Gets Publisher information --
Select publisherID, name, website from Publishers;


-- Gets transaction information --
Select transactionID, dateBorrowed, dateDue, bookID, memberID from BorrowingTransactions;

-- Gets author information --
Select authorID, CONCAT(firstName, " ", lastName) as name from Authors;



-- Selects book with filter --
Select title, author, ISBN from Books
where title = ":title_input";


-- Gets transaction information on tables --
Select transactionID, dateBorrowed, dateDue, title, first_name and last_name as Author, member from BorrowingTransactions
INNER JOIN Members ON BorrowingTransactions.memberID=Members.memberID
INNER JOIN Books ON BorrowingTransactions.bookID = Books.bookID
INNER JOIN Authors ON Books.authorID = Author.authorID;



-- Adds new member --
INSERT INTO Members (firstName, lastName, email)
VALUES (:first_name_input, :last_name_input, :email_input);


-- Adds new publisher --
INSERT INTO Publishers (name, website)
VALUES (:name_input, :website_input);

-- Adds new Author
INSERT INTO Authors (firstName, lastName)
VALUES (:firstName_input, :lastName_input);
-- Adds new Book --
INSERT INTO Books (title, ISBN, publisherID)
VALUES (:title_input, :ISBN_input,(SELECT publisherID from Publishers WHERE name = :name_input));


-- Maps books to authors
INSERT INTO BookAuthors (bookID, authorID)
VALUES((SELECT bookID FROM Books WHERE bookID=:bookID_input), (SELECT authorID FROM Authors WHERE authorID= :AuthorID_input));




-- Delete Member -- 
Delete FROM BorrowingTransactions where BorrowingTransactions.memberID = :memberID_input;
DELETE FROM Members where MemberID = :memberID_input;


-- Delete Publisher --
DELETE FROM Publishers WHERE (name = :name_input);


-- Delete Book -- 
DELETE FROM Books WHERE (ISBN = :ISBN_input);
DELETE FROM BookAuthors 
    WHERE
        bookID = (SELECT bookID FROM Books WHERE (ISBN = :ISBN_input));






-- Update member --
UPDATE Members
SET   firstName = :first_name_input, last_name = :last_name_input, email = :email_input
WHERE (memberID = :id_input);

-- Update Authors --
Update Authors
SET   firstName = :first_name_input, last_name = :last_name_input
WHERE (firstName = :firstName_input) and (lastName = lastName_input);


-- Update Publishers --
UPDATE Publishers
SET  name = :name_input, website = :website_input
WHERE (name = :name_input) and (:website = :website_input)
