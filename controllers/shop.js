const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const bcrypt = require("bcryptjs");

// const Product = require("../models/product");
// const Cart = require("../models/cart");
// const CartItem = require("../models/cart-item");
const Child = require("../models/Child");
// const Order = require("../models/order");
// const ITEMS_PER_PAGE = 3;


exports.getSponsor = (req, res, next) => {
  // $.post('https://secure8.convio.net/planlot/site/CRConsAPI?method=logout&api_key=planapilot&v=1.0',function(data,status) {
        
  //       },'html');
   res.render("shop/sponsorform", {
        path: "/sponsor",
        pageTitle: "Sponsor",
        // isAuthenticated: false,
      // errorMessage: req.flash("error"),
        oldInput : {
          email: '',
          password: '',
        },
        validationErrors: []
      });
};

exports.getHome = (req, res, next) => {

   res.render("shop/home", {
      
      });
};



exports.getChildLogin = (req, res, next) => {
const hello = Math.random().toString();
req.session.hello = hello;
  bcrypt.hash(hello, 12).then(hashedword => {
    res.render("shop/childlogin", {
      path: "/login",
      pageTitle: "Login",
      // isAuthenticated: false,
      hashedword: hashedword,
      errorMessage: req.flash("error"),
      oldInput : {
        email: '',
        password: '',
      },
      validationErrors: []
    });
  })
 };


 exports.getInd = (req, res, next) => {
  var genderquery = req.query.gender;
  var agequery = req.query.age;
  var countryquery = req.query.country;
  // console.log("genquery "+genderquery);
  // console.log("agequery "+agequery);
  // console.log("countryquery "+countryquery);


  if (((genderquery != undefined &&  genderquery != "0") || (agequery!= undefined && agequery!= "0")) && countryquery== "0") {
   
  console.log("came to second if loop");
    Child.findOnGender(req, res,next, genderquery, agequery, countryquery).then((child)=>{
      // req.session.destroy();
    // console.log('destroyed');
    //  console.log(child.length);
    var childrencountires = [];
    for (let ch of child) {
      childrencountires.push(ch.country_name__c);
    }
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }
   var uniquecountries = childrencountires.filter( onlyUnique );
   uniquecountries.sort();
       res.render('shop/child', {
          child: child,
          uniquecountries: uniquecountries,
          genderquery: genderquery,
          agequery: agequery,
          countryquery: countryquery
         });
     })
  }
 else if (genderquery != undefined || agequery!= undefined || (countryquery!= "0" && countryquery!= undefined )) {

    console.log("came to first if loop");
    var countrymakingzero = "0";
   Child.findOnGender(req, res,next, genderquery, agequery, countrymakingzero).then((childall)=>{
     // console.log(childall);
     var childrencountires = [];
     for (let ch of childall) {
       childrencountires.push(ch.country_name__c);
     }
     function onlyUnique(value, index, self) { 
       return self.indexOf(value) === index;
     }
    var uniquecountries = childrencountires.filter( onlyUnique );
   //  console.log("uniquecountries " + uniquecountries);
    uniquecountries.sort();
   Child.findOnGender(req, res,next, genderquery, agequery, countryquery).then((child)=>{
     // req.session.destroy();
   // console.log('destroyed');
   //  console.log(child.length);
    res.render('shop/child', {
         child: child,
         uniquecountries: uniquecountries,
         genderquery: genderquery,
         agequery: agequery,
         countryquery: countryquery
        });
    })
   })
 }
  else{
    console.log("came to third else loop");
    var genderquery = "0";
    var agequery = "0";
    var countryquery ="0";
  Child.findAll().then((child)=>{
    req.session.destroy();
    // console.log('destroyed');
    //  console.log(child.length);
    var childrencountires = [];
    for (let ch of child) {
      childrencountires.push(ch.country_name__c);
    }
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }
   var uniquecountries = childrencountires.filter( onlyUnique );
   uniquecountries.sort();
    res.render('shop/child', {
        child: child,
        cons:'',
        abc:'',
        uniquecountries: uniquecountries,
        genderquery: genderquery,
          agequery: agequery,
          countryquery: countryquery
        
      });
   })
   .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });

        }
};

exports.getIndi = (req, res, next) => {
  const abc = req.session.hello;
 const cons = req.query.co_id;
if(abc == undefined){
  res.redirect('/error');
}
 bcrypt.compare(abc,cons).then(doMatch => {
   if (doMatch) {
  Child.findAll().then((child)=>{
    req.session.destroy();
    console.log('destroyed');
    res.render('shop/child', {
        child: child,
        cons:'',
        abc:'',
        
      });
      
     
   })
   .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
   }
   else{
    res.redirect('/error');
   }
        
 })
       };
    // ; 
    // for(var i=0;i<images.length;i++) {
    //   if(images[i].id==req.params.id) {
    //     image = images[i];
    //     break;
    //   }
    // }
   

//   Child.findAll()
//       .then(([childs]) => {
//         console.log(numberofprods[0].counted);
//         const totalnumberofproducts = numberofprods[0].counted;
//         // console.log("total product count" + totalnumberofproducts);
//         Product.fetchAll(one, two).then(([rows, fieldData]) => {
//           res.render("shop/product-list", {
//             prods: rows,
//             pageTitle: "Shop",
//             path: "/products",
//             totalPages: totalnumberofproducts / ITEMS_PER_PAGE,
//             currentpage: page
//           });
//         });
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });




// };



// exports.getInd = (req, res, next) => {
//   const userId = req.session.user[0].id;
//   Child.getAllItems(userId)
//     .then(([cartitems, fieldData]) => {
//       res.render("shop/child", {
//         path: "/child",
//         pageTitle: "Donation Page",
//         products: cartitems,
//         isAuthenticated: req.session.isLoggedIn
//       });
//     })
//     .catch(err => {
//       console.log("Error In getCart");
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };



// exports.getProducts = (req, res, next) => {
//   const page = +req.query.page || 1;

//   const one = (page - 1) * ITEMS_PER_PAGE;
//   const two = ITEMS_PER_PAGE;

//   Product.fetchCount()
//     .then(([numberofprods]) => {
//       console.log(numberofprods[0].counted);
//       const totalnumberofproducts = numberofprods[0].counted;
//       // console.log("total product count" + totalnumberofproducts);
//       Product.fetchAll(one, two).then(([rows, fieldData]) => {
//         res.render("shop/product-list", {
//           prods: rows,
//           pageTitle: "Shop",
//           path: "/products",
//           totalPages: totalnumberofproducts / ITEMS_PER_PAGE,
//           currentpage: page
//         });
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findById(prodId)
//     .then(([product]) => {
//       res.render("shop/product-detail", {
//         product: product[0],
//         pageTitle: product.title,
//         path: "/products",
//         isAuthenticated: req.session.isLoggedIn
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// // exports.getIndex = (req, res, next) => {
// //   const page = +req.query.page || 1;

// //   const one = (page - 1) * ITEMS_PER_PAGE;
// //   const two = ITEMS_PER_PAGE;

// //   Product.fetchCount()
// //     .then(([numberofprods]) => {
// //       console.log(numberofprods[0].counted);
// //       const totalnumberofproducts = numberofprods[0].counted;
// //       // console.log("total product count" + totalnumberofproducts);
// //       Product.fetchAll(one, two).then(([rows, fieldData]) => {
// //         res.render("shop/index", {
// //           prods: rows,
// //           pageTitle: "Shop",
// //           path: "/",
// //           totalPages: totalnumberofproducts / ITEMS_PER_PAGE,
// //           currentpage: page
// //         });
// //       });
// //     })
// //     .catch(err => {
// //       console.log(err);
// //     });

// //   // .catch(err => {
// //   //   console.log(err);
// //   //   const error = new Error(err);
// //   //   error.httpStatusCode = 500;
// //   //   return next(error);
// //   // });
// // };

// exports.getCart = (req, res, next) => {
//   const userId = req.session.user[0].id;
//   CartItem.getAllItems(userId)
//     .then(([cartitems, fieldData]) => {
//       res.render("shop/cart", {
//         path: "/cart",
//         pageTitle: "Your Cart",
//         products: cartitems,
//         isAuthenticated: req.session.isLoggedIn
//       });
//     })
//     .catch(err => {
//       console.log("Error In getCart");
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   const prodPrice = req.body.productPrice;
//   const prodTitle = req.body.productTitle;
//   const userId = req.session.user[0].id;
//   const cartItem = new CartItem(prodId, prodPrice, prodTitle, userId);
//   cartItem.save(prodId, prodPrice, prodTitle, userId);
//   res.redirect("/cart");
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   CartItem.deleteProduct(prodId);
//   res.redirect("/cart");
// };

// exports.getCheckout = (req, res, next) => {
//   const userId = req.session.user[0].id;
//   CartItem.getAllItems(userId)
//     .then(([cartitems, fieldData]) => {
//       let total = 0;
//       cartitems.forEach(p => {
//         total += p.num * p.productPrice;
//       });
//       res.render("shop/checkout", {
//         path: "/checkout",
//         pageTitle: "Checkout",
//         products: cartitems,
//         totalSum: total
//       });
//     })
//     .catch(err => {
//       console.log("Error In getCart");
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.getOrders = (req, res, next) => {
//   const orderId = req.session.user[0].id;
//   Order.getAllItems(orderId)
//     .then(([orders, fieldData]) => {
//       res.render("shop/orders", {
//         path: "/orders",
//         pageTitle: "Your Order",
//         orders: orders,
//         orderId: orderId
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postOrder = (req, res, next) => {
//   const stripe = require("stripe")(
//     "sk_test_iMx5XB8xpCHHiVc3Lbk88Mcm00NHqYqVYg"
//   );
//   const token = req.body.stripeToken; // Using Express
//   let totalSum = 0;

//   const userId = req.session.user[0].id;
//   CartItem.getAllItems(userId)
//     .then(([cartitems, fieldData]) => {
//       cartitems.forEach(p => {
//         totalSum += p.num * p.productPrice;
//       });

//       let i;
//       for (i = 0; i < cartitems.length; i++) {
//         const order = new Order(
//           userId,
//           cartitems[i].productId,
//           cartitems[i].productTitle,
//           cartitems[i].num,
//           cartitems[i].productPrice
//         );
//         return order.save();
//       }
//     })
//     .then(result => {
//      console.log(result[0]);
//       (async () => {
//         const charge = await stripe.charges.create({
//           amount: totalSum * 100,
//           currency: "usd",
//           description: "Demo Charge",
//           source: token,
//           metadata: { order_id: userId }
//         });
//       })();
//       res.redirect("/orders");
//     })
//     .then(() => {
//       CartItem.deleteAllProds(userId);
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.getInvoice = (req, res, next) => {
//   const orderId = req.params.orderId;
//   const invoiceName = "abc-" + orderId + ".pdf";
//   const invoicepath = path.join("data", "invoices", invoiceName);

//   Order.getAllItems(orderId)
//     .then(([orders, fieldData]) => {
//       const pdfDoc = new PDFDocument();
//       let pricecount = 0;
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         'inline; filename="' + invoiceName + '"'
//       );
//       pdfDoc.pipe(fs.createWriteStream(invoicepath));
//       pdfDoc.pipe(res);
//       pdfDoc.fontSize(26).text("Invoice", {
//         underline: true
//       });
//       pdfDoc.text("--------------------------------");
//       orders.forEach(order => {
//         pdfDoc
//           .fontSize(14)
//           .text(
//             order.productTitle +
//               " - " +
//               order.productQuantity +
//               " X " +
//               order.productPrice
//           );
//         pricecount = pricecount + order.productQuantity * order.productPrice;
//       });
//       pdfDoc.text("--------------------------------");
//       pdfDoc.fontSize(26).text("Total Price paid : $" + pricecount);
//       pdfDoc.end();
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });

  // fs.readFile(invoicepath, (err, data) => {
  //   if(err) {
  //     return next(err);
  //   }
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
  //   res.send(data);
  // });

  // const file = fs.createReadStream(invoicepath);

  // file.pipe(res);
// };
