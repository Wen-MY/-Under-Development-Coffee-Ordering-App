import SQLite from 'react-native-sqlite-storage';
import jsonData from '../assets/CoffeeDescription/data.json'

class DatabaseInitialization{
    
     _initializeDatabase() {
    
        SQLite.deleteDatabase( //debug purpose
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
          )

        this.db = SQLite.openDatabase(
        { name: 'coffeeDatabase', location: 'default' },
        this._openCallback,
        this._errorCallback
    );
    
    this._databasePrepare();
    }
    _databasePrepare() {
        this.db.transaction(tx =>
            //Create item table if not exist
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR(20),description TEXT, base_price DECIMAL(6,2) ,type VARCHAR(30))',
                [],
                (sqlTxn,res)=>{
                    console.log('items table ready');
                },
                error=>{
                    console.log('error on creating items table' /*+ error.message*/);
                },
            )
        )
        this.db.transaction(tx =>
            // Create 'users' table
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(255), password VARCHAR(16))',
                [],
                (sqlTxn, res) => {
                console.log('users table ready');
                },
                error => {
                    console.log('error on creating users table'/* + error.message*/);
                },
            )
        )
        this.db.transaction(tx =>
            //Create 'orders' table
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total_price DECIMAL(10,2))',
                [],
                (sqlTxn, res) => {
                  console.log('orders table ready');
                },
                error => {
                  console.log('error on creating orders table'/* + error.message*/);
                },
            )
        )
        this.db.transaction(tx =>
             // Create 'cart' table 
             // item_options is stored the json data (option of the coffee)
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, item_id INTEGER, item_options TEXT, quantity INTEGER, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(item_id) REFERENCES items(id))',
                [],
                (sqlTxn, res) => {
                console.log('cart table ready');
                },
                error => {
                console.log('error on creating cart table'/* + error.message*/);
                },
            )
        )
        
        this.db.transaction(tx=>
            tx.executeSql(
                'SELECT * FROM items',
                [],
                (tx,results) => {
                    if(results.rows.length == 0){
                        jsonData.forEach(item => {
                            const {name, description, price, type } = item;
                        tx.executeSql(
                            'INSERT INTO items(name,description,base_price,type) VALUES(?,?,?,?)'
                        ,
                        [item.name,item.description,item.price,item.type],
                        (tx, results) => {
                              console.log(item.name +' inserted successfully'); //debug purpose
                        },
                        error =>{
                            console.log('error in inserting data');
                        }
                        );
                    });
                    }
                    else {
                        console.log('table filled,default insertion ignored');
                        
                    }
                }
            ),
        )
        //debug purpose
        this.db.transaction(tx=>
            tx.executeSql(
                'SELECT id,name FROM items',
                [],
                (tx, results) => {
                const items = results.rows.raw();
                console.log('All items in the table:', items);
                },
                error => {
                console.log('Error retrieving items:', error);
                }
            )
        );
    }
    openCallback(){
        console.log('database open sucess');
    }
    errorCallback(err){
        console.log('Error in opening database :' + err);
    }
}
export default DatabaseInitialization;