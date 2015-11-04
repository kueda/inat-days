iNaturalist Observation Streaks
===============================

Some [iNaturalist](http://www.inaturalist.org) users use the site regularly. Like, really regularly. Here I'm visualizing different content types from the iNat database by users with more than 10,000 records using the excellent [EventDrops](https://github.com/marmelab/EventDrops) visualization for [D3](d3js.org).

For my own future reference, these data files were exported from the iNat database like this:

```BASH
psql inaturalist_production -c "COPY (SELECT DISTINCT u.login, o.observed_on AS date FROM observations o JOIN users u ON u.id = o.user_id WHERE observed_on > '1960-01-01' AND u.id IN (9706,10285,2873,1115,12610,2991,1,15329,12158,2179)) TO STDOUT WITH CSV HEADER" > observations-observed-on.csv

psql inaturalist_production -c "COPY (SELECT DISTINCT u.login, DATE(o.created_at) AS date FROM observations o JOIN users u ON u.id = o.user_id WHERE observed_on > '1960-01-01' AND u.id IN (2873,1,15329,9706,8778,2179,9434,505,12610,1115)) TO STDOUT WITH CSV HEADER" > observations-created-on.csv

psql inaturalist_production -c "COPY (SELECT DISTINCT u.login, DATE(i.created_at) AS date FROM identifications i JOIN users u ON u.id = i.user_id WHERE u.id IN (1,477,2179,2991,9706,15329,10787,1115,4860,13200)) TO STDOUT WITH CSV HEADER" > identifications-created-on.csv
```

I selected those users with the most days like this:

```SQL
-- users with the most days in the field
SELECT
  u.id,
  u.login,
  count(*) AS days
FROM
  (
    SELECT DISTINCT user_id, observed_on FROM observations
    WHERE observation_photos_count > 0
  ) AS user_days 
    JOIN users u ON u.id = user_days.user_id
GROUP BY u.id, u.login
ORDER BY count(*) DESC
LIMIT 10

-- users with the most days adding observations
SELECT
  u.id,
  u.login,
  count(*)
FROM
  (
    SELECT DISTINCT user_id, DATE(created_at) FROM observations
    WHERE observation_photos_count > 0
  ) AS user_days 
    JOIN users u ON u.id = user_days.user_id
GROUP BY u.id, u.login
ORDER BY count(*) DESC
LIMIT 10

-- users with the most days adding identifications
SELECT
  u.id,
  u.login,
  count(*)
FROM
  (
    SELECT DISTINCT i.user_id, DATE(i.created_at) FROM identifications i
    JOIN observations o ON o.id = i.observation_id
    WHERE i.user_id != o.user_id
  ) AS user_days 
    JOIN users u ON u.id = user_days.user_id
GROUP BY u.id, u.login
ORDER BY count(*) DESC
LIMIT 10
```