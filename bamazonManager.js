var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
  host     : 'localhost',
  port: 3306,
  user     : 'root',
  password : '',
  database : 'bamazon'
});


connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
  start(); 
});


var viewProducts = function() {
  connection.query('SELECT product_name FROM products', function(err, res) {
    console.log(res);
  });
};


var viewLowInventory = function() {
  connection.query('SELECT product_name FROM products WHERE stock_quantity < 5', function(err, res) {
    console.log(res);
  });
};


var addToInventory = function() {
  connection.query('SELECT product_name SET ? WHERE ?', [{
    stock_quantity: userInput
  },
  {
    item_id: chosenItem
  }], function(err, res) {
    console.log(res);
  });
};


var addNewProducts = function() {
  connection.query('INSERT INTO products(product_name, price, stock_quantity) VALUE ?', [x, y, z], function(err, res) {
    console.log(res);
  });
};


var start = function() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'Please choose an action from the following choices',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Products'],
      name: 'action'
    }
  ]).then(function(data) {
    if(data.action === 'View Products for Sale') {
      viewProducts();
    }
    else if (data.action === 'View Low Inventory') {
      viewLowInventory();
    }
    else if(data.action === 'Add to Inventory') {
      addToInventory();
    }
    else if (data.action === 'Add New Products') {
      addNewProducts();
    }
  });
};
