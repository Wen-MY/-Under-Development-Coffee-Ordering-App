import SQLite from 'react-native-sqlite-storage';

class DatabaseInitialization{
     _initializeDatabase() {
        this.db = SQLite.openDatabase(
        { name: 'coffeeDatabase', location: 'default' },
        this._openCallback,
        this._errorCallback
    );
    this._databasePrepare();
    }
    _databasePrepare() {
        this.db.transaction(tx =>{
            //Create item table if not exist
            tx.executeSql(
                'CREATE TABLE items (id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR(20),description TEXT, base_price DECIMAL(6,2) ,type VARCHAR(30))',
                [],
                (sqlTxn,res)=>{
                    console.log('items table ready');
                },
                error=>{
                    console.log('error on creating items table' /*+ error.message*/);
                },
            )}
        )
        this.db.transaction(tx =>{
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
            )}
        )
        this.db.transaction(tx =>{
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
            )}
        )
        this.db.transaction(tx =>{
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
            )}
        )
        this.db.transaction(tx=>
            tx.executeSql(
                'SELECT * FROM items',
                [],
                (tx,results) => {
                    if(results.rows.length == 0){
                        tx.executeSql(
                            'INSERT INTO items(name,description,base_price,type) VALUES("Americano","For a milder coffee experience, the Americano is the perfect choice. It\'s crafted by adding hot water to a shot or two of espresso, diluting the intensity while preserving the coffee\'s authentic taste. The result is a light and flavorful drink with a slightly nutty undertone.Ingredients: Freshly brewed espresso, hot water.",7.90,"Classic"'
                            //more default data insert here
                        ,
                        [],
                        (tx, results) => {
                            if (results.rowsAffected > 0) {
                              console.log('dummy data inserted successfully');
                              this._query();
                            } else {
                              console.log('error in inserting data');
                            }
                          },
                        );
                    }else {
                        console.log('table filled,default insertion ignored');
                    }
                }
            ),
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