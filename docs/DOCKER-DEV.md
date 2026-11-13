# MRA development database

This Compose project starts only an isolated MySQL database for local development. It uses database `mra_dev`, host port `3307`, and volume `mra_mysql_dev_data`; it does not use or modify the default Compose database volume.

## Start

```powershell
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml ps
```

Connect from the host with:

- Host: `127.0.0.1`
- Port: `3307`
- Database: `mra_dev`
- User: `mra_dev`
- Password: `mra_dev_local_only`

To point the locally running app at this database, set these values in the app's local environment:

```env
MRA_DB_HOST=127.0.0.1
MRA_DB_PORT=3307
MRA_DB_DATABASE=mra_dev
MRA_DB_USER=mra_dev
MRA_DB_PASSWORD=mra_dev_local_only
```

For an app running in another container on the same Compose network, use host `mra-db-dev` and port `3306` instead.

## Stop and reset

```powershell
docker compose -f docker-compose.dev.yml stop
docker compose -f docker-compose.dev.yml down
```

The volume survives `stop` and `down`. To deliberately erase and recreate the dev database, run `docker compose -f docker-compose.dev.yml down -v`.

On first startup, MySQL loads the checked-in table-definition dump. The SQL file has no `INSERT` statements, so no production rows or demo records are imported. Initialization runs only while the dev volume is empty.
