SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS BorrowingTransactions;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Books;

/* Create database tables */

CREATE TABLE Authors (
    authorID        INT AUTO_INCREMENT NOT NULL,
    first_name      VARCHAR(50),
    last_name       VARCHAR(50),
    PRIMARY KEY(authorID)
);

CREATE TABLE Books (
    bookID          INT AUTO_INCREMENT NOT NULL,
    title           VARCHAR(120) NOT NULL,
    authorID        INT,
    ISBN            INT(13) NOT NULL,
    is_checked_out  VARCHAR(1),
    PRIMARY KEY(bookID),
    FOREIGN KEY(authorID) REFERENCES Authors(authorID),
    UNIQUE(bookID, ISBN)
);

CREATE TABLE Members (
    memberID        INT AUTO_INCREMENT NOT NULL,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    checkedOut      INT,
    PRIMARY KEY(memberID)
);

CREATE TABLE BorrowingTransactions (
    transactionID   INT AUTO_INCREMENT NOT NULL,
    bookID          INT NOT NULL,
    memberID        INT NOT NULL,
    dateBorrowed    DATE,
    dateDue         DATE,
    PRIMARY KEY(transactionID),
    FOREIGN KEY(bookID) REFERENCES Books(bookID),
    FOREIGN KEY(memberID) REFERENCES Members(memberID),
    UNIQUE(transactionID, bookID, memberID)
);

/* Populate tables with data */

INSERT INTO Authors (first_name, last_name)
VALUES
    ('Patrick', 'Rothfuss'),
    ('Brandon', 'Sanderson'),
    ('Jeff', 'Kinney'),
    ('Douglas', 'Adams');

INSERT INTO Books (title, authorID, ISBN, is_checked_out)
VALUES
    ('The Name of the Wind', 1, 9780575081406, 0),
    ('The Wise Man''s Fear', 1, 9780756407199, 1),
    ('The Way of Kings', 2, 9780765265279, 1),
    ('Diary of a Wimpy Kid', 3, 9782343445239, 0),
    ('The Hitchhiker''s Guide to the Galaxy', 4, 2345464434343, 1);

INSERT INTO Members (first_name, last_name, email, checkedOut)
VALUES
    ('Samuel', 'Zink', 'zinksam@oregon.edu', 1),
    ('Heidi', 'Ly', 'something@oregonstate.edu', 2),
    ('Sponge', 'Bob', 'squarepants@yahoo.com', 0);

INSERT INTO BorrowingTransactions (bookID, memberID, dateBorrowed, dateDue)
VALUES
    (2, 1, '2024-02-06', '2025-02-06'),
    (3, 2, '2012-01-04', '2012-02-04'),
    (5, 2, '2012-01-04', '2012-02-04');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

