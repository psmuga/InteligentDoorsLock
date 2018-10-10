Run database:
    mongod.exe --dbpath=[DATABASE_DIR]

    example
    mongod.exe --dbpath=c:\Projects\IE\database

Database backup:
    mongodump.exe -h [HOST] -d [DATABASE] -o [DIRECTORY]

    example:
    mongodump.exe -h localhost -d internet-eng-dev -o ie-180316

Database restore:
    mongorestore.exe -h [HOST] [DIRECTORY] --drop

    example:
    mongorestore.exe -h localhost ie-180316 --drop