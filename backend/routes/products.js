const express = require('express');
const multer = require('multer');

const router = express.Router();
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', checkAuth, multer({storage: storage}).single('image'), (req,res,next) => {
  const url = req.protocol + '://' + req.get('host');
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })
  product.save().then(createdProduct => {
    res.status(201).json({
      message: 'Product added',
      product: {
        id: createdProduct._id,
        title: createdProduct.title,
        description: createdProduct.description,
        price: createdProduct.price,
        location: createdProduct.location,
        imagePath: createdProduct.imagePath
      }
    })
  })
});

router.get('',(req,res,next) => {
  // console.log(req.query)
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const productQuery = Product.find();
  let fetchedProducts;
  if (pageSize && currentPage) {
    productQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);

  }
  productQuery
    .then(documents =>{
      fetchedProducts = documents;
      return Product.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Products fetched successfully',
        products: fetchedProducts,
        maxProducts: count
    })
  })
})

router.put('/:id', checkAuth ,multer({storage: storage}).single('image'), (req,res,next) => {
  let imagePath = req.body.imagePath
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const product = new Product ({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    imagePath: imagePath,
    creator: req.userData.userId
  })
  Product.updateOne({_id: req.params.id, creator: req.userData.userId}, product)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: 'product updated'
        })
      }
      else{
        res.status(401).json({
          message: "Unauthorized, can't modify"
        })
      }
    })
})

router.get('/:id',(req,res,next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        res.status(200).json(product)
      } else {
        res.status(404).json({message: 'Product cannot find'})
      }
    })
})


router.delete('/:id', checkAuth, (req,res,next) => {
  Product.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Deleted successfully'
        })
      }
      else{
        res.status(401).json({
          message: "Unauthorized, can't delete"
        })
      }
  })
})


module.exports = router;
