const SQLite = require('react-native-sqlite-storage').default;
const wipeDatabase = () => {
    const db = SQLite.openDatabase({ name: 'coffeeDatabase', location: 'default' });
  
    db.transaction(tx => {
      tx.executeSql('DELETE FROM items', [], (_, result) => {
        console.log('All data in the items table has been deleted.');
      });
  
      // Repeat for other tables if needed
    });
  };
  
  wipeDatabase();
  