CREATE SCHEMA IF NOT EXISTS five_guys_highscores_database;
CREATE SCHEMA IF NOT EXISTS five_guys_user_database;


#
CREATE TABLE IF NOT EXISTS five_guys_user_database.users
(
    id             BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(20)  NOT NULL DEFAULT 'player',
    password       VARCHAR(60)  NOT NULL UNIQUE,
    account_points INT UNSIGNED NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS five_guys_highscores_database.highscores
(
    user_id BIGINT NOT NULL,
    score   BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES five_guys_user_database.users (id)
);

#
CREATE TABLE IF NOT EXISTS five_guys_user_database.userCharacter
(
    characterID BIGINT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY ,
    toolboxID BIGINT NOT NULL

#     FOREIGN KEY (toolboxID) REFERENCES ()
);

CREATE TABLE IF NOT EXISTS five_guys_user_database.character_Toolbox (
    characterID BIGINT NOT NULL REFERENCES userCharacter (characterID),
    toolboxID INT NOT NULL PRIMARY KEY,
    abilityCount INT
);

CREATE TABLE IF NOT EXISTS user_base (

    username VARCHAR(20)  NOT NULL DEFAULT 'player',
    score    BIGINT NOT NULL DEFAULT 0,
    password VARCHAR(20)

);

INSERT INTO user_base VALUES ('Rahul', 500, 'weakpassword');
INSERT INTO user_base VALUES ('Mitch', 204, 'weakerpassword');
INSERT INTO user_base VALUES ('Austin', 345, 'str0ngpa55w0rd');
INSERT INTO user_base VALUES ('Kevin', 128, 'niveK!');