
Parse.Cloud.define("share", function(request, response) {
  var ShareArticle = Parse.Object.extend("ShareArticle");
  var shareArticle = new ShareArticle();

  shareArticle.set("url", request.params.url);
  shareArticle.set("title", request.params.title);

  shareArticle.save(null, {
    success: function(shareArticle) {
      response.success({
        "stored": true,
        "objectId": shareArticle.objectId 
      });
    },
    error: function(shareArticle, error) {
      response.error({
        "stored": false,
        "title": shareArticle.get("title"),
        "url": shareArticle.get("url")
      });
    }
  });
});

Parse.Cloud.define("article", function(request, response) {
  var ShareArticle = Parse.Object.extend("ShareArticle");
  var query = new Parse.Query(ShareArticle);
  query.equalTo("objectId", request.params.objectId);
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function(error) {
      response.error(error);
    }
  });
});

Parse.Cloud.define("articles", function(request, response) {
  var ShareArticle = Parse.Object.extend("ShareArticle");
  var ArticleCollection = Parse.Collection.extend({
    model: ShareArticle,
    query: (new Parse.Query(ShareArticle))
  });

  var collection = new ArticleCollection();

  collection.fetch({
    success: function(collection) {
      response.success(collection.models);
    },
    error: function(collection, error) {
      response.error(error);
    }
  });
});