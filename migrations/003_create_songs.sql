USE devdb;

CREATE TABLE songs (
   id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
   song_title VARCHAR(256) NOT NULL,
   artist_id INT NOT NULL,

   CONSTRAINT `fk_song_artist`
       FOREIGN KEY (artist_id) REFERENCES artists (id)
           ON DELETE CASCADE
           ON UPDATE RESTRICT
)
