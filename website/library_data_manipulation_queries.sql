


-- Gets all member information --
SELECT memeberID, first_name and last_name as name, email from Members;


-- Gets all book information --
Select bookID, title, ISBN from Books;


-- Gets Author information --
Select authorID, first_name, last_name from Authors;

-- Gets transaction information --
Select transactionID, dateBorrowed, dateDue, title, first_name and last_name as Author, member from BorrowingTransactions
INNER JOIN Members ON BorrowingTransactions.memberID=Members.memberID
INNER JOIN Books ON BorrowingTransactions.bookID = Books.bookID
INNER JOIN Authors ON Books.authorID = Author.authorID;



-- Adds new member --
INSERT INTO Members (first_name, last_name, email)
VALUES (:first_name_input, :last_name_input, email_input);

-- Adds new Book --
INSERT INTO Books (title, authorID, ISBN)
VALUES (:title_input,:authorID_input :ISBN_input);


-- Delete member -- 
DELETE FROM Members WHERE (first_name = :first_name_input) and (last_name = last_name_input);


-- Delete Book -- 
DELETE FROM Books WHERE (ISBN = :ISBN_input);

-- Update member --
UPDATE Members
SET   first_name = :first_name_input, last_name = :last_name_input, email = :email_input
WHERE (first_name = :first_name_input) and (last_name = last_name_input);
