import SQLite from 'react-native-sqlite-storage';
import jsonData from '../assets/CoffeeDescription/data.json';

class DatabaseInitialization {
  _initializeDatabase() {
    // Delete the database for debugging purposes
    /*
    SQLite.deleteDatabase(
      {
        name: 'coffeeDatabase',
        location: 'default',
      },
      () => {
        console.log('Database deleted successfully.');
      },
      error => {
        console.log('Error deleting database:', error);
      }
    );*/
    // Open the database
    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase', location: 'default' },
      this._openCallback,
      this._errorCallback
    );
    
    // Prepare the database schema
    this._prepareDatabaseSchema();
  }

  _prepareDatabaseSchema() {
    this.db.transaction(tx => {
      // Create 'items' table if it does not exist
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), description TEXT, base_price DECIMAL(6,2), type VARCHAR(30))',
        [],
        (sqlTxn, res) => {
          console.log('Items table ready');
        },
        error => {
          console.log('Error creating items table' /*+ error.message*/);
        }
      );

      // Create 'orders' table if it does not exist
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total_amount DECIMAL(8,2), order_date DATETIME DEFAULT CURRENT_TIMESTAMP)',
        [],
        (sqlTxn, res) => {
          console.log('Orders table ready');
        },
        error => {
          console.log('Error creating orders table' /* + error.message */);
        }
      );

      // Create 'order_items' table if it does not exist
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, item_name VARCHAR(20), quantity INTEGER, unit_price DECIMAL(8,2), FOREIGN KEY(order_id) REFERENCES orders(id))',
        [],
        (sqlTxn, res) => {
          console.log('Order_items table ready');
        },
        error => {
          console.log('Error creating order_items table' /* + error.message */);
        }
      );

      // Create 'cart' table if it does not exist
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, item_name VARCHAR(20), item_options TEXT, quantity INTEGER, unit_price DECIMAL(8,2), FOREIGN KEY(user_id) REFERENCES users(id))',
        [],
        (sqlTxn, res) => {
          console.log('Cart table ready');
        },
        error => {
          console.log('Error creating cart table' /* + error.message*/);
        }
      );
    });

    // Perform default data insertion
    this._insertDefaultData();
  }

  _insertDefaultData() {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM items',
        [],
        (tx, results) => {
          if (results.rows.length === 0) {
            jsonData.forEach(item => {
              const { name, description, price, type } = item;
              tx.executeSql(
                'INSERT INTO items(name, description, base_price, type) VALUES (?, ?, ?, ?)',
                [item.name, item.description, item.price, item.type],
                (tx, results) => {
                  console.log(item.name + ' inserted successfully');
                },
                error => {
                  console.log('Error inserting data');
                }
              );
            });
          } else {
            console.log('Table filled, default insertion ignored');
          }
        }
      );
    });
  }

  insertOrderWithItems(userId, totalAmount, items) {
    this.db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [userId, totalAmount],
        (tx, results) => {
          const orderId = results.insertId;
          console.log(`Order #${orderId} inserted successfully`);

          items.forEach(item => {
            tx.executeSql(
              'INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)',
              [orderId, item.item_id, item.quantity],
              (tx, results) => {
                console.log(`Item ${item.item_id} added to order ${orderId}`);
              },
              (tx, error) => {
                console.log(`Error adding item ${item.item_id} to order ${orderId}: ${error.message}`);
              }
            );
          });
        },
        (tx, error) => {
          console.log('Error inserting order:', error);
        }
      );
    });
  }

  openCallback() {
    console.log('Database opened successfully');
  }

  errorCallback(err) {
    console.log('Error in opening database: ' + err);
  }
}

export default DatabaseInitialization;