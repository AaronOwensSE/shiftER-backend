# Dot source sensitive information from a separate environment variable file.
. .\env.ps1

# SQL Commands
$SQL_DELETE_DB = "DROP DATABASE $PROJECT_DB;"
$SQL_DELETE_USER = "DROP USER $PROJECT_DB_USER;"

# Set the password used by psql commands.
$env:PGPASSWORD = $MAIN_DB_PASSWORD

Write-Host "Deleting project database . . ."

# Delete database.
Write-Host "Deleting database $PROJECT_DB . . ."
psql -U $MAIN_DB_USER -d $MAIN_DB -c "$SQL_DELETE_DB"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to delete database $PROJECT_DB. Database may not exist."

    # Remove psql password so that calling script cannot continue to use.
    Remove-Item Env:\PGPASSWORD

    exit 1
}

Write-Host "Database $PROJECT_DB deleted."

# Delete user.
Write-Host "Deleting user $PROJECT_DB_USER . . ."
psql -U $MAIN_DB_USER -d $MAIN_DB -c "$SQL_DELETE_USER"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to delete user $PROJECT_DB_USER. User may not exist."

    # Remove psql password so that calling script cannot continue to use.
    Remove-Item Env:\PGPASSWORD

    exit 2
}

Write-Host "User $PROJECT_DB_USER deleted."

Write-Host "Project database deleted."

# Remove psql password so that calling script cannot continue to use.
Remove-Item Env:\PGPASSWORD
