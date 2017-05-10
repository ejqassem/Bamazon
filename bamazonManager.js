var inquirer = require('inquirer');
var mysql = require('mysql');
var chalk = require('chalk');
var Table = require('easy-table');

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
  connection.query('SELECT * FROM products', function(err, res) {
    var products = [];
    for(var i = 0; i < res.length; i++) {
      var obj = {
        item_id: res[i].item_id,
        product_name: res[i].product_name,
        price: res[i].price,
        stock_quantity: res[i].stock_quantity
      };
      products.push(obj);
    }
    inquirer.prompt([
      {
        type: 'list',
        message: function() {
          var redText = chalk.red('Press enter on any item to return to the main screen');
          return 'All available inventory \n' + redText + '\n ID ||  Product || Price($) || Current Stock \n -----------------------------------------';
        },
        choices: function(){
          var allInventory = [];
          for(var i in products) {
            allInventory.push(products[i].item_id + " || " + products[i].product_name + " || " + products[i].price  + " || " + products[i].stock_quantity);
          }
          return allInventory;
        },
        name: 'allInventory'
      }
    ]).then(function(data) {
      start();
    });
  });
};


var viewLowInventory = function() {
  connection.query('SELECT product_name FROM products WHERE stock_quantity < 5', function(err, res) {
    var redText = chalk.red(' less than 5');
    console.log('========================');
    console.log('The following have a quantity' + redText);
    var count = 1;
    for(var i in res) {
      console.log(count + ") " + res[i].product_name);
      count++;
    }
    console.log('========================');
    start();
  });
};


var addToInventory = function() {
  inquirer.prompt([
    {
      type: 'confirm',
      message: 'Would you like to add to inventory?',
      name: 'confirm'
    }
  ]).then(function(data) {
    if(data.confirm) {
      connection.query('SELECT * FROM products', function(err, res) {
        var products = [];
        for(var i = 0; i < res.length; i++) {
          var obj = {
            item_id: res[i].item_id,
            product_name: res[i].product_name,
            price: res[i].price,
            stock_quantity: res[i].stock_quantity
          };
          products.push(obj);
        }
        inquirer.prompt([
          {
            type: 'list',
            message:

            'All available inventory \n Press enter on any item to update inventory \n ID ||  Product || Price($) || Current Stock \n ----------------------------------------------',
            choices: function(){
              var allInventory = [];
              for(var i in products) {
                allInventory.push(products[i].item_id + " || " + products[i].product_name + " || " + products[i].price  + " || " + products[i].stock_quantity);
              }
              return allInventory;
            },
            name: 'allInventory'
          },
          {
            type: 'input',
            message: 'How much would you like to add to stock inventory',
            name: 'updateInventory',
            validate: function(value) {
              if(value) {
                return true;
              }
              console.log('\nPlease input a number');
              return false;
            }
          }
        ]).then(function(data) {
          var arr = data.allInventory.split('||');
          var currentQuant = parseFloat(arr[3]);
          var item_id = arr[0];
          var currentItem = arr[1];
          var amtToAdd = parseFloat(data.updateInventory);
          var updatedQuant = currentQuant + amtToAdd;
          connection.query('UPDATE products SET ? WHERE ?', [{
            stock_quantity: updatedQuant
          },
          {
            item_id: item_id
          }], function(err, res) {
            if(err) throw err;
            console.log('Successfully updated inventory for ' + currentItem);
            console.log('Amount before update: ' + currentQuant + '\nAmount after update: ' + updatedQuant);
            start();
          });
        });
      });
    }
    else {
      start();
    }
  });
};


var addNewProducts = function() {
  inquirer.prompt([
    {
      type: 'input',
      message: 'What item would you like to add?',
      name: 'itemName'
    },
    {
      type: 'input',
      message: "What department will sell this item",
      name: 'itemDepartment'
    },
    {
      type: 'input',
      message: 'What is the cost of this item?',
      name: 'itemCost'
    },
    {
      type: 'input',
      message: 'What is the quantity of this item?',
      name: 'itemQuantity'
    }
  ]).then(function(data) {
    var itemName = data.itemName;
    var itemDepartment = data.itemDepartment;
    var itemCost = data.itemCost;
    var itemQuantity = data.itemQuantity;
    connection.query('INSERT INTO products SET ?', {product_name:itemName, department_name: itemDepartment, price:itemCost, stock_quantity:itemQuantity}, function(err, res) {
      if(err) throw err;
      connection.query('SELECT * FROM products', function(err, res) {
        if(err) throw err;
        var products = [];
        for(var i = 0; i < res.length; i++) {
          var obj = {
            item_id: res[i].item_id,
            product_name: res[i].product_name,
            price: res[i].price
          };
          products.push(obj);
        }
        var t = new Table();
        products.forEach(function(product) {
          t.cell('Item(#)', product.item_id);
          t.cell('Product', product.product_name);
          t.cell('Price($)', product.price, Table.number(2));
          t.newRow();
        });
        console.log(t.toString());
        // console.log("------------------------------------");
        // console.log(chalk.bold("Item(#)||   Product     ||  Price($)"));
        // console.log("------------------------------------");
        // for(var i in products) {
        //   console.log(products[i].item_id + "    ||    " + products[i].product_name + "    ||    " + products[i].price);
        // }
        start();
      });
    });
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
