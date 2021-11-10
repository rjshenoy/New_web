CREATE TABLE IF NOT EXISTS leaderboard (
  username VARCHAR(15),
  score    SMALLINT(3200)  
);

INSERT INTO leaderboard(user,score)
VALUES('Rahul Shenoy', 200),
('Mitch Segura', 250),
('Jonathan Powers', 300),
('Michael Metz', 350),
('Austin Skeffington', 400),
('Kevin Jacob', 450);