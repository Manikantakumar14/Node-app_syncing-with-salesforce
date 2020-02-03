const Product = require("../models/product");
const fileHelper = require('../util/file');
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: [],
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },

      errorMessage: "Attached file is not an image.",
      validationErrors: []
    });
  }

  const userId = req.session.user[0].id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;

  const product = new Product(
    null,
    title,
    imageUrl,
    description,
    price,
    userId
  );

  console.log(userId);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      // return res.status(500).render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again',
      //   validationErrors: []
      // });
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      //throw new Error('Dummy');
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product[0],
        hasError: false,
        errorMessage: [],
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  var updatedimageUrl = null;
  const image = req.file;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  console.log(image);
  if (!image) {
    const updatedProduct = new Product(
      prodId,
      updatedTitle,
      null,
      updatedDesc,
      updatedPrice
    );
   updatedProduct.altern(prodId).catch(err => {
      console.log("this occured here");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    res.redirect("/admin/products");
  }
else{
  fileHelper.deleteFile(updatedimageUrl);
  updatedimageUrl = image.path;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedimageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.alter(prodId).catch(err => {
    console.log("this occured here");
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
  res.redirect("/admin/products");
}
  
};

exports.getProducts = (req, res, next) => {
  console.log(req.session.user[0].id);
  const userId = req.session.user[0].id;
  console.log(userId);
  Product.fetchAllAdminprods(userId)
    .then(([rows, fieldData]) => {
      res.render("admin/products", {
        prods: rows,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
     
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  
  const prodId = req.params.productId;
  //const image = req.file;
  //console.log(image.path);
  //fileHelper.deleteFile(image.path);
  console.log(prodId);
  console.log("In postdelete");
  Product.deleteById(prodId)
    .then(() => {
      res.status(200).json({message: 'Success!'});
    })
    .catch(err => {
      res.status(500).json({message: 'Deleting product failed!'}); 
    });
};
