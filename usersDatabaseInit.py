import sqlite3

# Connect to the database or create if it doesn't exist
db = sqlite3.connect('usersDB.sqlite')

# Drop the table if it already exists
db.execute('DROP TABLE IF EXISTS users')

# Create the users table
db.execute('''
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        balance DECIMAL(10, 2) NOT NULL
    )
''')

# Create a cursor
cursor = db.cursor()

# Insert a sample user into the users table
cursor.execute('''
    INSERT INTO users(username, email, password, balance)
    VALUES('Default-User', 'example@email.com', 'admin123', 0.00)
''')
cursor.execute('''
    INSERT INTO users(username, email, password, balance)
    VALUES('Wen', 'wen@gmail.com', 'wen12345', 200.20)
''')

# Commit the transaction
db.commit()

# Close the database connection
db.close()
