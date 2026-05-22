import Database from 'better-sqlite3';
const db = new Database('sqlite.db');
const tableInfo = db.prepare("PRAGMA table_info(inscriptions)").all();
console.log("Table info for inscriptions:", tableInfo);
db.close();
