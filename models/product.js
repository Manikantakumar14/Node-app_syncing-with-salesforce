const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price, userId) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.userId = userId;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description, userId) VALUES (?, ?, ?, ?,?)',
      [this.title, this.price, this.imageUrl, this.description, this.userId]
    );
  }

  alter(id) {
       return db.execute(
      'UPDATE products SET title = ?, price = ?, imageUrl = ?, description = ? WHERE products.id = ?',
      [this.title, this.price, this.imageUrl, this.description, id]
    );
  }

  altern(id) {
    return db.execute(
   'UPDATE products SET title = ?, price = ?, description = ? WHERE products.id = ?',
   [this.title, this.price, this.description, id]
 );
}

  static deleteById(id) {
    return db.execute(
    'DELETE FROM products WHERE products.id = ?', [id]);
  }

  static fetchAllAdminprods(userId) {
    return db.execute('SELECT * FROM products where products.userId = ?', [userId]);
  }
  static fetchAll(one, two) {
    return db.execute('SELECT * FROM products LIMIT ?, ?', [one, two]);
  }
 

  static fetchCount() {
    return db.execute('SELECT COUNT(*) as counted FROM products');
  }
  	


  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
