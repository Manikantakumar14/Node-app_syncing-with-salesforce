const db = require('../util/database');

const Cart = require('./cart');

module.exports = class User {
  constructor(id, email, password, resetToken, resetTokenExpiration) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.resetToken = resetToken;
    this.resetTokenExpiration = resetTokenExpiration;
    
  }
  save() {
    return db.execute(
      'INSERT INTO users (id, email, password) VALUES (?, ?, ?)',
      [this.id, this.email, this.password]
    );
  }

  static tokenInsert(email, resettoken, resetexpiry) {
    return db.execute('UPDATE users SET resetToken = ?, resetTokenExpiration= ? WHERE email = ?',
    [resettoken, resetexpiry, email]);
  }

  static findById(id) {
    return db.execute('SELECT * FROM users WHERE users.id = ?', [id]);
  }
  static findByToken(token) {
    return db.execute('SELECT * FROM users WHERE users.resetToken = ?', [token]);
  }

  static updatePassword(userId, newpassword, resettoken, resetexpiry) {
    return db.execute('UPDATE users SET password= ?, resetToken = ?, resetTokenExpiration= ? WHERE id = ?',
    [newpassword, resettoken, resetexpiry, userId]);
  }
    
  static findByEmail(email) {
    return db.execute('SELECT * FROM users WHERE users.email = ?', [email]);
  }
};