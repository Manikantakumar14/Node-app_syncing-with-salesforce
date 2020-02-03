const db = require('../util/database');

const Product = require('./product');

module.exports = class Cart {
  constructor(cartId, userId) {
    this.cartId = cartId;
    this.userId = userId;
   }
}
