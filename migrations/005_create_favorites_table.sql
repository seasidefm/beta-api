USE devdb;

CREATE TABLE favorites (
  song INT NOT NULL,
  user INT NOT NULL,

  INDEX user_songs (song, user),

  CONSTRAINT `fk_song`
    FOREIGN KEY (song) REFERENCES songs (id)
    ON DELETE CASCADE,

  CONSTRAINT `fk_user`
    FOREIGN KEY (user) REFERENCES users (id)
    ON DELETE CASCADE,

  -- Only allow user to favorite a song once
  unique(song, user)
);