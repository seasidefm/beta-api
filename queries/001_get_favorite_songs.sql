WITH faves AS (SELECT u.name as user, s.song_title, a.name as artist from Favorite as f
    JOIN Song as s on f.song = s.id
    JOIN Artist a  on s.id = a.id
    JOIN User u  on f.user = u.id
    WHERE u.name = 'duke_ferdinand')
SELECT user, COUNT(DISTINCT song_title) as num_favorites, COUNT(DISTINCT artist) as artists FROM faves;