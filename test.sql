USE devdb;

SELECT *
FROM User
ORDER BY id;

SELECT *
FROM Artist
WHERE name LIKE '%Tatsuro%';

SELECT A.name, COUNT(*) AS song_count
FROM Song AS S
    JOIN Artist AS A on A.id = S.artist_id
GROUP BY artist_id
HAVING song_count > 10
ORDER BY 2 DESC;

# SELECT s.song_title, a.name as 'artist'
# FROM Song AS s
# JOIN Artist a on s.artist_id = a.id
# WHERE a.name LIKE 'Minako Y%';

SELECT U.name, COUNT(*) AS fave_count
FROM Favorite AS F
    JOIN User AS U on U.id = F.user
WHERE U.name != 'duke_ferdinand' AND U.name != 'seasidefm'
GROUP BY U.id
ORDER BY 2 DESC
LIMIT 10;

SELECT A.name AS artist, song_title, COUNT(*) AS fave_count
FROM Favorite
    INNER JOIN Song AS S
        ON Favorite.song = S.id
    INNER JOIN Artist AS A
        ON S.artist_id = A.id
GROUP BY 2
ORDER BY COUNT(*) DESC;


SELECT U.name, COUNT(*) as count
FROM Favorite AS F
    JOIN User AS U ON F.user = U.id
GROUP BY user