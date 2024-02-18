SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS BorrowingTransactions;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Books;

/* Create database tables */


CREATE OR REPLACE TABLE Books (
    bookID          INT AUTO_INCREMENT NOT NULL,
    title           VARCHAR(120) NOT NULL,
    ISBN            INT(13) NOT NULL,
    isCheckedOut    TINYINT(1),
    PRIMARY KEY(bookID),
    UNIQUE(bookID, ISBN)
);

CREATE OR REPLACE TABLE Authors (
    authorID        INT AUTO_INCREMENT NOT NULL,
    firstName       VARCHAR(50),
    lastName        VARCHAR(50),
    PRIMARY KEY(authorID),
    UNIQUE(authorID)
);

CREATE OR REPLACE TABLE BookAuthors(
    bookID          INT,
    authorID        INT,
    PRIMARY KEY(bookID, authorID),
    FOREIGN KEY(bookID) REFERENCES Books(bookID),
    FOREIGN KEY(authorID) REFERENCES Authors(authorID)
);


CREATE TABLE Members (
    memberID        INT AUTO_INCREMENT NOT NULL,
    firstName       VARCHAR(50) NOT NULL,
    lastName        VARCHAR(50) NOT NULL,
    email           VARCHAR(100) NOT NULL,
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

INSERT INTO Authors (firstName, lastName)
VALUES
    ('Patrick', 'Rothfuss'),
    ('Brandon', 'Sanderson'),
    ('Jeff', 'Kinney'),
    ('Douglas', 'Adams');

INSERT INTO Books (title, authorID, ISBN, isCheckedOut)
VALUES
    ('The Name of the Wind', 1, 9780575081406, 0),
    ('The Wise Man''s Fear', 1, 9780756407199, 1),
    ('The Way of Kings', 2, 9780765265279, 1),
    ('Diary of a Wimpy Kid', 3, 9782343445239, 0),
    ('The Hitchhiker''s Guide to the Galaxy', 4, 2345464434343, 1);

INSERT INTO BookAuthors(bookID, authorID)
VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 3),
    (5, 4);

INSERT INTO Members (firstName, lastName, email)
VALUES
    ('Samuel', 'Zink', 'zinksam@oregon.edu'),
    ('Heidi', 'Ly', 'something@oregonstate.edu'),
    ('Sponge', 'Bob', 'squarepants@yahoo.com');

INSERT INTO BorrowingTransactions (bookID, memberID, dateBorrowed, dateDue)
VALUES
    (2, 1, '2024-02-06', '2025-02-06'),
    (3, 2, '2012-01-04', '2012-02-04'),
    (5, 2, '2012-01-04', '2012-02-04');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

