/*
  localDB © 2012 Michael Donaldson
  Simple localStorage Database
  Version: 0.2.1
  
  License: MIT (http://opensource.org/licenses/MIT)
*/

function localdb(db)
{
  //Check if database already exists, if it doesn't create it
  if(localStorage[db] === undefined){
    localStorage[db] = JSON.stringify({});
  }
  
  //Load database
  var database = JSON.parse(localStorage[db]);
  
  //Define a save function that will save changes made to the database
  var save = function(database){
    localStorage[db] = JSON.stringify(database);
    return true;
  };
  
  var localdb = {

    /*
      Delete Database
    */
    deleteDatabase: function(dbname){
      
      if(localStorage[dbname] !== undefined){
        delete localStorage[dbname];
        return true;
      } else {
        console.error('A database with the name "'+dbname+'" could not be found');
        return false;
      }

    },
    
    /*
      Create Table
    */
    createTable: function(table){
      if(database[table] === undefined){
        database[table] = {};
        save(database);
      } else {
        console.error('A table with the name "'+table+'" already exists');
        return false;
      }
    },
    
    /*
      Delete Table
    */
    dropTable: function(table){
      
      if(database[table] !== undefined){
        delete database[table];
        save(database);
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
    },

    /*
      Insert Data
    */
    insert: function(table, data){
      
      if(database[table] === undefined){
        localdb.createTable(table);
      }

      database[table] = data;

      save(database);
    },

    /*
      Table Exists
    */
    tableExists: function(table){
      
      if(database[table] !== undefined){
        return true;
      } else {
        return false;
      }
      
    },

    /*
      Export JSON
    */
    find: function(table){

      if(table){
        if(database[table] !== undefined){

           var data = database[table];

          return database[table];
        } else {
          console.error('Table not found');
          return false;
        }
      } else {
        return database;
      }
    }

  };
  
  return localdb;
}