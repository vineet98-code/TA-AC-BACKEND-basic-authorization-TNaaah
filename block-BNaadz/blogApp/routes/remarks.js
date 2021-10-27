var express = require('express');
var router = express.Router();

var Article = require('../models/article');
var Remark = require('../models/remark');


router.get('/:remarkId/edit', function (req, res, next) {
  var remarkId = req.params.remarkId;
  Remark.findById(remarkId, (err, remark) => {
    if (err) return next(err);
    res.render('editRemark', { remark });
  });
});

router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndUpdate(id, req.body, (err, updatedRemark) => {
    if (err) return next(err);
    res.redirect('/articles/' + updatedRemark.articleId);
  });
});

router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Remark.findByIdAndRemove(id, (err, remark) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(remark.eventId, { $pull: { remark: remark.id }}, (err, event) => {
        if (err) return next(err);
        res.redirect('/articles/' + remark.articleId);
      });
  });
});

router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, remark) => {
    if (err) return next(err);
    res.redirect('/articles/' + remark.articleId);
  });
});

router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, remark) => {
    if (err) return next(err);
    res.redirect('/articles/' + remark.articleId);
  });
});


module.exports = router;