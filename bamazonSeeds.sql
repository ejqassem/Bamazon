CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
  item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(40) NOT NULL,
  department_name VARCHAR(40) NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INT(6) NOT NULL,
  Primary Key(item_id)
);

CREATE TABLE department (
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NULL,
  over_head_costs INT NULL,
  total_sales INT NULL,
  Primary key(department_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) VALUE ('iPhone 7', 'Electronics', 850, 500), ('iPhone 6', 'Electronics', 400, 200), ('iPhone 5', 'Electronics', 100, 3), ('iPhone 4', 'Electronics', 50, 40), ('iPhone 3Gs', 'Electronics', 20, 1), ('iPhone 7S', 'Electronics', 1000, 900), ('iPhone 7+', 'Electronics', 1050, 1200), ('iPhone 6S', 'Electronics', 550, 60), ('iPhone 5S', 'Electronics', 100, 200), ('iPhone SE', 'Electronics', 350, 20), ('iPod Nano', 'Electronics', 150, 2);
