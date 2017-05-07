var mysql = require('mysql');
var inquirer = require('inquirer');
// var columnify = require('columnify');

var connection = mysql.createConnection({
  host     : 'localhost',
  port: 3306,
  user     : 'root',
  password : '',
  database: 'bamazon'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

var start = function() {
  connection.query('SELECT item_id, product_name, price FROM products', function(err, res) {
    var products = [];
    for(var i = 0; i < res.length; i++) {
      var obj = {
        item_id: res[i].item_id,
        product_name: res[i].product_name,
        price: res[i].price
      };
      products.push(obj);
    }
    inquirer.prompt([
      {
        type: 'list',
        choices: function() {
          var displayProducts = [];
          for (var i in products) {
            displayProducts.push(products[i].item_id + " || " + products[i].product_name + " || " + products[i].price);
          }
          return displayProducts; 
        },
        message: 'Please input product id of what item you\'d like to buy',
        name: 'productChoice'
      },
      {
        type: 'input',
        message: 'Please input how many device you would like to purchase',
        name: 'purchaseAmount'
      }
    ]).then(function(data) {

      console.log(data.productChoice);
      var arr = data.productChoice.split("||");
      var chosenId = arr[0];
      var chosenItem = arr[1];
      var purchaseAmount = data.purchaseAmount;
      console.log('Amount to purchase: ' + purchaseAmount);
      connection.query('SELECT stock_quantity FROM products WHERE ?', {
        item_id: chosenId
      }, function(err, res) {

        var stockQuantity = res[0].stock_quantity;
        console.log('We have a quantity of ' + stockQuantity + ' items in the store');
        if(stockQuantity > purchaseAmount) {
          console.log(`You have successfully made an order for ${purchaseAmount} ${chosenItem} `);
          connection.query('UPDATE products SET ? WHERE ?', [
          {
            stock_quantity: (stockQuantity - purchaseAmount)
          },
          {
            item_id: chosenId
          }], function(err, res) {
            console.log("Successfully updated table");
            setTimeout(start, 500);
          });
        }
        else {
          console.log("Sorry, Insufficient Quantity");
          setTimeout(start, 500);
        }
      });
    });
  });
};

start();
