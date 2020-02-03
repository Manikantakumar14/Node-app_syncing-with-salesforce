const db = require("../util/database");
const Product = require("./product");
const Cart = require("./cart");

module.exports = class Order {
  constructor(orderId, productId, productTitle, productQuantity, productPrice) {
    this.orderId = orderId;
    this.productId = productId;
    this.productTitle = productTitle;
    this.productQuantity = productQuantity; 
    this.productPrice = productPrice;
  }

  save() {
    return db.execute(
      "INSERT INTO orders (orderId, productId, productTitle, productQuantity, productPrice) VALUES (?, ?, ?, ?, ?)",
      [this.orderId, this.productId, this.productTitle, this.productQuantity, this.productPrice]
    );
  }

  static getAllItems(orderId) {
    return db.execute(
      "SELECT productTitle, productQuantity, productPrice FROM orders where orderId = ?",
      [orderId]
    );
  }
};
