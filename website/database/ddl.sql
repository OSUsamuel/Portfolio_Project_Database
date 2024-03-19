-- Disable foregin key checks and auto commit
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS BorrowingTransactions;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Publishers;

-- Create database tables

-- Books Table
CREATE OR REPLACE TABLE Books (
    bookID          INT AUTO_INCREMENT NOT NULL,
    title           VARCHAR(120) NOT NULL,
    authorID        INT NOT NULL,
    ISBN            INT(13) NOT NULL,
    publisherID     INT,
    FOREIGN KEY(authorID) REFERENCES Authors(authorID),
    FOREIGN KEY(publisherID) REFERENCES Publishers(publisherID),
    PRIMARY KEY(bookID),
    UNIQUE(bookID, ISBN)
);

-- Publishers Table
CREATE OR REPLACE TABLE Publishers (
    publisherID     INT AUTO_INCREMENT NOT NULL,
    name            VARCHAR(120) NOT NULL,
    website         VARCHAR(120) NOT NULL,
    PRIMARY KEY(publisherID)

);

-- Authors Table
CREATE OR REPLACE TABLE Authors (
    authorID        INT AUTO_INCREMENT NOT NULL,
    firstName       VARCHAR(50),
    lastName        VARCHAR(50),
    PRIMARY KEY(authorID),
    UNIQUE(authorID)
);

-- BookAuthors Table
CREATE OR REPLACE TABLE BookAuthors(
    bookID          INT,
    authorID        INT,
    PRIMARY KEY(bookID, authorID),
    FOREIGN KEY(bookID) REFERENCES Books(bookID),
    FOREIGN KEY(authorID) REFERENCES Authors(authorID)
);


-- Members Table
CREATE TABLE Members (
    memberID        INT AUTO_INCREMENT NOT NULL,
    firstName       VARCHAR(50) NOT NULL,
    lastName        VARCHAR(50) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    PRIMARY KEY(memberID)
);

-- BorrowingTransactions Table
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

-- Populate tables with data

-- Insert Authors data
INSERT INTO Authors (firstName, lastName)
VALUES
    ('Patrick', 'Rothfuss'),
    ('Brandon', 'Sanderson'),
    ('Jeff', 'Kinney'),
    ('Douglas', 'Adams');

-- Insert Books data
INSERT INTO Books (title, authorID, ISBN, publisherID)
VALUES
    ('The Name of the Wind', 1, 9780575081406, 1 ),
    ('The Wise Man''s Fear', 1, 9780756407199, 1),
    ('The Way of Kings', 2, 9780765265279, 2),
    ('Diary of a Wimpy Kid', 3, 9782343445239, 3),
    ('The Hitchhiker''s Guide to the Galaxy', 4, 2345464434343, 4);

-- Insert Publisher data
INSERT INTO Publishers (name, website)
VALUES
    ('DAW Books', 'https://www.dawbooks.com'),
    ('Tor Books', 'https://www.tor.com'),
    ('Amulet Books', 'https://www.abramsbooks.com/amulet/'),
    ('Harmony Books', 'https://www.harmonybooks.com');

-- Insert BookAuthors data
INSERT INTO BookAuthors(bookID, authorID)
VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 3),
    (5, 4);

-- Insert Members data
INSERT INTO Members (firstName, lastName, email)
VALUES
    ('Samuel', 'Zink', 'zinksam@oregon.edu'),
    ('Heidi', 'Ly', 'something@oregonstate.edu'),
    ('Sponge', 'Bob', 'squarepants@yahoo.com');

-- Insert BorrowingTransactions data
INSERT INTO BorrowingTransactions (bookID, memberID, dateBorrowed, dateDue)
VALUES
    (1, 1, '2024-02-06', '2025-02-06'),
    (1, 1, '2012-01-04', '2012-02-04'),
    (2, 1, '2012-01-04', '2012-02-04');

--Re-enable foreign key checks and commit changes
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

