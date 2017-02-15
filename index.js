var ApiBuilder = require('claudia-api-builder'),
  AWS = require('aws-sdk'),
  api = new ApiBuilder(),
  dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;

// Add new book
api.post('/book', function (request) {
  'use strict';
  var id = request.body.bookId;
  var params = {
    TableName: request.env.tableName,
    Item: {
      bookId: id,
      name: request.body.name,
      author: request.body.author,
      genre: request.body.genre
    }
  };

  return dynamoDb.put(params).promise()
    .then(function () {
      return 'Created book with id ' + id;
    });
}, { success: 201 });

// Get book for {id}
api.get('/book/{id}', function (request) {
  'use strict';

  var params = {
    TableName: request.env.tableName,
    Key: {
      bookId: parseInt(request.pathParams.id)
    }
  };

  return dynamoDb.get(params).promise()
    .then(function (response) {
      return response.Item;
    });
});

// Delete book with {id}
api.delete('/book/{id}', function (request) {
  'use strict';
  var id = parseInt(request.pathParams.id);
  var params = {
    TableName: request.env.tableName,
    Key: {
      bookId: id
    }
  };

  return dynamoDb.delete(params).promise()
    .then(function () {
      return 'Deleted book with id "' + id;
    });
}, {success: { contentType: 'text/plain'}});

api.addPostDeployConfig('tableName', 'DynamoDB Table Name:', 'configure-db');