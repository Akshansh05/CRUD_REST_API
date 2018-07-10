var express =require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var product = require('./product');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;
var router = express.Router();

mongoose.connect('mongodb://localhost:27017/products');
var getAuth=function (req, res, next) {
    if(req.user) { 
    db.getPerms({role_id: req.user.role_id, resource_id: req.resource.id})
       .then(function(perms){
          var allow = false;
          perms.forEach(function(perm){
              if (req.method == "POST" && perms.create) allow = true;
              else if (req.method == "GET" && perms.read) allow = true;
              else if (req.method == "PUT" && perms.write) allow = true;
              else if (req.method == "DELETE" && perm.delete) allow = true;

          })
          if (allow) next();
          else res.status(403).send({error: 'access denied'});
       })
   } else res.status(400).send({error: 'invalid token'})
}

router.post ('/', getAuth)
router.route('/products').post(function (req, res) {
var p = new product();
    p.title = req.body.title;
    p.content = req.body.content;
    p.visiblity = req.body.visiblity;
    p.photo = req.body.photo;
    p.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.send({ message: 'Product Created !' })
    })
   
});
router.route('/products').get(function (req, res) {
    product.find(function (err, products) {
        if (err) {
            res.send(err);
        }
        res.send(products);
    });
});

router.route('/products/:product_id').get(function (req, res) {

    product.findById(req.params.product_id, function (err, prod) {
        if (err)
            res.send(err);
        res.json(prod);
    });
});
router.route('/products/:product_id').put(function (req, res) {

    product.findById(req.params.product_id, function (err, prod) {
        if (err) {
            res.send(err);
        }
        prod.title = req.body.title;
        prod.content = req.body.content;
        prod.visiblity = req.body.visiblity;
        prod.photo = req.body.photo;
        prod.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product updated!' });
        });
     });
    });
router.route('/products/:product_id').delete(function (req, res) {

    product.remove({ _id: req.param.product_id }, function (err, prod) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    })

});

app.use(cors());
app.use('/api', router);
app.listen(port);
console.log('REST API is runnning at ' + port);