/**
 * 
 * Definition Procedure
 * 
 */
CREATE OR REPLACE PROCEDURE TOOLSHOP_DEV.CREATE_USER (
    IN firstname VARCHAR(50),
    IN lastname VARCHAR(50),
    IN email VARCHAR(50),
    IN phone VARCHAR(50),
    IN "password" VARCHAR(255),
    OUT email_upper VARCHAR(255),
    OUT encrypted_password VARCHAR(255)
    )
BEGIN

set email_upper = upper(email);
set encrypted_password = encrypt("password", 'some salt');

insert into TOOLSHOP_DEV.users (firstname, lastname, email, phone, password)
values (firstname, lastname, email_upper, phone, encrypted_password);

END;

/**
 * 
 * "Normal Call"
 * 
 */
 CALL TOOLSHOP_DEV.CREATE_USER('John', 'Doe', 'john.doe@easi.net', '666', 'super secret', OUT1, OUT2);

/**
 * 
 * "Wrapped in a script"
 * => invalid SQL because it misses an into??
 * 
 */
BEGIN DECLARE OUT1 VARCHAR(255);
DECLARE OUT2 VARCHAR(255);
CALL TOOLSHOP_DEV.CREATE_USER('John','Doe', 'john.doe@easi.net', '666', 'super secret', OUT1, OUT2);
values(OUT1, OUT2);
END;

/**
 * 
 * Solution with global variables
 * Works but very slow...
 * 
 */
CREATE OR REPLACE VARIABLE OUT1 VARCHAR(50);
CREATE OR REPLACE VARIABLE OUT2 VARCHAR(50);
CALL TOOLSHOP_DEV.CREATE_USER('John','Doe', 'john.doe@easi.net', '666', 'super secret', OUT1, OUT2);
values(OUT1, OUT2);

/**
 * 
 * Check result
 */
select *
from toolshop_dev.users;

/**
 * 
 * Clear data
 */
delete
from toolshop_dev.users
where lower(firstname) = 'john';


/**
 * 
 * Second Definition Procedure
 * Only IN parameters
 * 
 */
CREATE OR REPLACE PROCEDURE TOOLSHOP_DEV.CREATE_USER_DAS (
    IN firstname VARCHAR(50),
    IN lastname VARCHAR(50),
    IN email VARCHAR(50),
    IN phone VARCHAR(50),
    IN "password" VARCHAR(255),
    OUT password_upper VARCHAR(255)
    )
BEGIN

set password_upper = upper(email);
set TOOLSHOP_DEV.OUT1 = password_upper;
set TOOLSHOP_DEV.OUT2 = encrypt("password", 'some salt');

insert into TOOLSHOP_DEV.users (firstname, lastname, email, phone, password)
values (firstname, lastname, TOOLSHOP_DEV.OUT1, phone, TOOLSHOP_DEV.OUT2);

END;