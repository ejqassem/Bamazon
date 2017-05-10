var mysql = require('mysql');
var inquirer = require('inquirer');
var columnify = require('columnify');


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
  start();
});


function updateTotalSales(name, cost) {
  connection.query('SELECT total_sales FROM department WHERE ? ', {
    department_name : name
  }, function(err, res) {
    var currentTotalSales = parseFloat(res[0].total_sales);
    console.log('currentTotalSales is ' + currentTotalSales);
    var updatedTotal = currentTotalSales + cost;
    console.log("Total Sales for department" + name + " is " + updatedTotal);
    connection.query('UPDATE department SET ? WHERE ?', [{
      total_sales: updatedTotal
    },
    {
      department_name : name
    }], function(err, res) {
      console.log('Successfully updated total_sales');
    });
  });
}


var start = function() {
  connection.query('SELECT item_id, product_name, price FROM products', function(err, res) {
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
    inquirer.prompt([
      {
        type: 'list',
        choices: function() {
          var displayProducts = [];
          for (var i = 0; i < products.length; i++) {
            displayProducts.push(products[i].item_id + "    ||    " + products[i].product_name + "    ||    " + products[i].price);
          }
          return displayProducts;
        },
        message: 'Please input product id of what item you\'d like to buy \n Item(#)||   Product     ||  Price($)\n----------------------------------------',
        name: 'productChoice'
      },
      {
        type: 'input',
        message: 'Please input how many you would like to purchase',
        validate: function(value) {
          if(value) {
            return true;
          }
          console.log('\nPlease input a number');
          return false;
        },
        name: 'purchaseAmount'
      }
    ]).then(function(data) {
      console.log(data.productChoice);
      var arr = data.productChoice.split("||");
      var chosenId = arr[0];
      var chosenItem = arr[1].trim();
      var chosenCost = parseFloat(arr[2]);
      var purchaseAmount = data.purchaseAmount;
      connection.query('SELECT stock_quantity, department_name FROM products WHERE ?', {
        item_id: chosenId
      }, function(err, res) {
        var chosenDepartment = res[0].department_name;
        var stockQuantity = res[0].stock_quantity;
        console.log('We have a quantity of ' + stockQuantity + ' items in the store');
        if(stockQuantity > purchaseAmount) {
          var totalCost = (purchaseAmount * chosenCost);
          console.log('Total cost is ' + totalCost);
          console.log("You have successfully made an order for " + purchaseAmount + " of " + chosenItem);
          console.log("Your total cost for is $" + totalCost + ".");
          connection.query('UPDATE products SET ? WHERE ?', [
          {
            stock_quantity: (stockQuantity - purchaseAmount)
          },
          {
            item_id: chosenId
          }], function(err, res) {
            updateTotalSales(chosenDepartment, totalCost);
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
