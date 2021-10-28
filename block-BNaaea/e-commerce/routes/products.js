var express = require('express');
var router = express.Router();

var Article = require('../models/product');
var Remark = require('../models/remark');
var User = require('../models/User');

// to protect all the routes other than list of articles amd article details page
var auth = require('../middleware/auth');



// list articles
router.get('/', (req, res) =>{
  Article.find({}, (err, articles) => {
    Article.distinct("event_category", (err, allCategories) =>{
      if (err) return next(err);
      console.log(err, allCategories);
      Article.distinct("location", (err, allLocations) =>{
        if (err) return next(err);
        console.log(err, allLocations);
        res.render('articles', {articles:articles, allCategories: allCategories, allLocations: allLocations });
      });
  });

  })
})

// For rendering article and create form => GET on "/books/new"
router.get('/new', auth.loggedInUser, (req, res, next) => {
    res.render('addArticles');
});

// Fetch Single event
router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  Article.findById(id).populate('remark').populate('author', 'name email').exec((err, article) => {
      console.log(article);
      res.render('singleArticle', { article: article })
    });
});

// This is protected route pluging before the handling all endpoints
router.use(auth.loggedInUser);


// send data and create article
router.post('/', (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(" ");
  req.body.author = req.user.id; // this is going to extract the current id from the user and put it on the author field indide the req.body
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles');
  });
});


// Edit articles form 
router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render('editArticlesForm', { article: article });
  });
});

// Delete Articles operation
router.get('/:id/delete', (req, res, next) => {
    var id = req.params.id;
    // check whether the current logged in user 1 matches with the author of the article
    
    Article.findByIdAndDelete(id, (err, article) => {
      if (err) return next(err);
      Article.findByIdAndUpdate(article.articleId, { $pull: { booksId: article._id }},
        (err, author) => {
            res.redirect('/articles/');
        });
    });
});
 
// Update Articles 
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, updateArticle) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

// increment likes
router.get('/:id/likes', (req, res, next) => {
    var id = req.params.id;
    Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
      if (err) return next(err);
      res.redirect('/articles/' + id);
    });
  });

//  increment dislikes
router.get('/:id/dislikes', (req, res, next) => {
    var id = req.params.id;
    Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
        if (err) return next(err);
        res.redirect('/articles/' + id);
    });  
});

// Remarks send
router.post('/:articleId/remark', (req, res, next) => {

  var articleId = req.params.articleId;
  console.log(req.body);
  req.body.articleId = articleId;
  Remark.create(req.body, (err, remark) => { //newly created remark
    if (err) return next(err);
    Article.findByIdAndUpdate(articleId, { $push: { remark: remark.id }}, (err, updatedEvent) => {
        if (err) return next(err);
        res.redirect('/articles/' + articleId);
      });
    });
});



module.exports = router;