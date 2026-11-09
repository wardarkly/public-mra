# Run MRA with Docker Compose

## Requirements

- Docker Desktop (Windows/macOS) or Docker Engine with the Compose plugin (Linux)
- Network access from the app container to the hospital HIS database, if HIS features are needed

## First startup

1. From the project root, create the local Compose environment file:

   ```powershell
   Copy-Item .env.docker.example .env
   ```

2. Edit `.env`. Replace all four `replace_with_...` values with strong, unique secrets. Set the HIS host, database, user, and password if the app must access HOSxP/HIS. From Docker Desktop on Windows, `host.docker.internal` can refer to a service running on the host machine.

3. Build the web image and start the app and its MRA MySQL database:

   ```powershell
   docker compose up -d --build
   ```

   Compose waits for MySQL to become healthy. On the first startup, MySQL creates the configured database and imports `database/db_mra_prod_202610091047.sql` as its schema.

4. Open <http://localhost:3000/mra>.

## Common commands

```powershell
docker compose logs -f app       # follow web logs
docker compose logs -f db        # follow database logs
docker compose stop              # stop containers and keep database data
docker compose up -d             # start again
docker compose down              # remove containers and network; keep database data
```

To rebuild after changing application code, run `docker compose up -d --build`.

## Database notes

- The MRA database is stored in the `mra_mysql_data` Docker volume and survives container restarts and `docker compose down`.
- The initialization SQL only runs when that volume is empty. Changing the SQL file later does not update an existing database; use a migration or a deliberate backup and restore.
- `docker compose down -v` deletes the database volume and all MRA data. Only use it when you intend to reset the database.
- The checked-in production SQL file defines the tables and views; it does not seed user accounts or demo data. The separate demo dump is not imported.
- HIS is an external, read-only database connection configured through `.env`; Compose does not create an HIS database.
- Keep `.env` private and back up the database volume regularly.
