/*global require, module*/
var ApiBuilder = require('claudia-api-builder'),
  AWS = require('aws-sdk'),
  api = new ApiBuilder(),
  dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;

// Add new book
api.post('/book', function (request) {
  'use strict';
  var params = {
    TableName: request.env.tableName,
    Item: {
      bookId: request.body.bookId,
      name: request.body.name,
      author: request.body.author,
      genre: request.body.genre
    }
  };

  return dynamoDb.put(params).promise();
}, { success: 201 });

// Get book for {id}
api.get('/book/{id}', function (request) {
  'use strict';

  var params = {
    TableName: request.env.tableName,
    Key: {
      bookId: request.pathParams.id
    }
  };

  return dynamoDb.get(params).promise()
    .then(function (response) {
      return response.Item;
    });
});

// Delete book with {id}
api.delete('/user/{id}', function (request) {
  'use strict';
  var params = {
    TableName: request.env.tableName,
    Key: {
      bookId: request.pathParams.id
    }
  };

  return dynamoDb.delete(params).promise()
    .then(function () {
      return 'Deleted book with id "' + id + '"';
    });
}, {success: { contentType: 'text/plain'}});

api.addPostDeployConfig('tableName', 'DynamoDB Table Name:', 'configure-db');