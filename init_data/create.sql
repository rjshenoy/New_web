CREATE SCHEMA IF NOT EXISTS 5guys_highscores_database;
CREATE SCHEMA IF NOT EXISTS 5guys_user_database;


#
CREATE TABLE IF NOT EXISTS 5guys_user_database.users
(
    id             BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name     VARCHAR(20)  NOT NULL,
    last_name      VARCHAR(20)  NOT NULL,
    username       VARCHAR(20)  NOT NULL DEFAULT 'player',
    email          VARCHAR(120) NOT NULL UNIQUE,
    password       VARCHAR(60)  NOT NULL UNIQUE,
    account_points INT UNSIGNED NOT NULL DEFAULT 0
);



CREATE TABLE IF NOT EXISTS 5guys_highscores_database.highscores
(
    user_id BIGINT NOT NULL,
    score   BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES 5guys_user_database.users (id)
);

#
CREATE TABLE IF NOT EXISTS 5guys_user_database.userCharacter
(
    characterID BIGINT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY ,
    toolboxID BIGINT NOT NULL

#     FOREIGN KEY (toolboxID) REFERENCES ()
);

CREATE TABLE IF NOT EXISTS 5guys_user_database.character_Toolbox (
    characterID BIGINT NOT NULL REFERENCES userCharacter (characterID),
    toolboxID INT NOT NULL PRIMARY KEY,
    abilityCount INT
);

CREATE TABLE IF NOT EXISTS leaderboard_scores (

    username       VARCHAR(20)  NOT NULL DEFAULT 'player',
    score   BIGINT NOT NULL DEFAULT 0  

);

INSERT INTO leaderboard_scores VALUES ('Rahul', 500);
INSERT INTO leaderboard_scores VALUES ('Mitch', 204);
INSERT INTO leaderboard_scores VALUES ('Austin', 345);
INSERT INTO leaderboard_scores VALUES ('Kevin', 128);

CREATE VIEW leaderboard_table AS SELECT * FROM 5guys_user_database.leaderboard_final ORDER BY DESC;
