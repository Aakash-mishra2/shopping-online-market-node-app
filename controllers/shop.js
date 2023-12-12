const Product = require('../models/product');
const Cart = require('../models/cart');
exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    console.log(products);
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path:'/'
    });
  }).catch(err => console.log(err));
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  //sql query execute and returns array of 2 arrays, first array is array of 
  //objects representing rows as a result. second one is metadata about database
  Product.findAll({ where: { id: prodId}})
  .then(products => {
    res.render('shop/product-detail', {
      product: products[0],
      pageTitle: products[0].title,
      path: '/products'
    });
  })
  .catch(err => console.log(err));
  // Product.findByPk(prodId)
  // .then(product => {
  //   //product is still an array and view expects a single object so pass [0]th index object
  //   res.render('shop/product-detail', {
  //     product: product,
  //     pageTitle: product.title,
  //     path: '/products'
  //  });
  // })
  // .catch(err => console.log(err));

};
exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path:'/'
    });
  }).catch(err => console.log(err));
};
exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const productsInCart = [];
      for (product of products) {
        //filter out the products that are actually in the cart.
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if (cartProductData) {
          productsInCart.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: productsInCart
      });
    });
  });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //could have also passed product price as hidden input to cart but this is cleaner approach.
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
}
exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
