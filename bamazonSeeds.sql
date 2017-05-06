CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
  item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(40) NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INT(6) NOT NULL,
  Primary Key(item_id)
);
INSERT INTO products(product_name, price, stock_quantity) VALUE ('iPhone 7', 300, 500), ('iPhone 6', 300, 200), ('iPhone 5', 300, 3), ('iPhone 4', 300, 40), ('iPhone 3Gs', 300, 1), ('iPhone 7S', 300, 900), ('iPhone 7+', 300, 1200), ('iPhone 6S', 300, 60), ('iPhone 5S', 300, 200), ('iPhone SE', 300, 20), ('iPhone', 1000, 2);
