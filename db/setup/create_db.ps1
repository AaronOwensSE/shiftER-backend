# Dot source sensitive information from a separate environment variable file.
. .\env.ps1

# SQL Commands
$SQL_CREATE_USER = "CREATE USER $PROJECT_DB_USER WITH PASSWORD '$PROJECT_DB_PASSWORD';"
$SQL_CREATE_DB = "CREATE DATABASE $PROJECT_DB OWNER $PROJECT_DB_USER;"

# Set the password used by psql commands.
$env:PGPASSWORD = $MAIN_DB_PASSWORD

Write-Host "Initializing project database . . ."

# Create user.
Write-Host "Creating user $PROJECT_DB_USER . . ."
psql -U $MAIN_DB_USER -d $MAIN_DB -c "$SQL_CREATE_USER"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create user $PROJECT_DB_USER. User may already exist."

    # Remove psql password so that calling script cannot continue to use.
    Remove-Item Env:\PGPASSWORD

    exit 1
}

Write-Host "User $PROJECT_DB_USER created."

# Create database.
Write-Host "Creating database $PROJECT_DB . . ."
psql -U $MAIN_DB_USER -d $MAIN_DB -c "$SQL_CREATE_DB"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create database $PROJECT_DB. Database may already exist."

    # Remove psql password so that calling script cannot continue to use.
    Remove-Item Env:\PGPASSWORD

    exit 2
}

Write-Host "Database $PROJECT_DB created."

Write-Host "Project database initialized."

# Remove psql password so that calling script cannot continue to use.
Remove-Item Env:\PGPASSWORD
