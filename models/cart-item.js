const db = require('../util/database');
const Product = require('./product');
const Cart = require('./cart');

module.exports = class CartItem {
  constructor(productId, productPrice, productTitle, userId) {
    this.productId = productId;
    this.productTitle = productTitle;
    this.productPrice = productPrice;
    this.userId = userId;
    }

   save(prodid, prodprice, prodTitle, userId) {
    return db.execute(
      'INSERT INTO cartItems (productId, productPrice, productTitle, userId) VALUES (?, ?, ?, ?)',
      [prodid, prodprice, prodTitle, userId]
    );
  }

  static getAllItems(userId) {
    return db.execute(
        //'SELECT productId, productTitle, COUNT(*) AS `num` FROM cartItems  where userId = ? GROUP BY productTitle, productId',
        'SELECT productId,productPrice, productTitle, COUNT(*) AS `num` FROM cartItems  where userId = ? GROUP BY productTitle, productId, productPrice',
        [userId]
      );
  }
  static deleteProduct(prodId) {
    return db.execute(
      'DELETE from cartItems where productId = ?', [prodId]
    );
  }

  static deleteAllProds(userId) {
    return db.execute(
      'DELETE FROM cartItems where userId = ?', [userId]
    );
  }



};