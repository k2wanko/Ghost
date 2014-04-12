var when = require('when')
var SparqlClient = require('sparql-client');
var util = require('util');
var squel = require('squel');
var endpoint = 'http://ja.dbpedia.org/sparql';
var reqOpt = {
  timeout: 5000
};

// Get the leaderName(s) of the given citys
// if you do not bind any city, it returns 10 random leaderNames
var createQuery = function(name) {
  var q = squel.select()
    .where('{ $a rdfs:label ?@ja . }', name)
    .limit(10)
    .distinct();
  return q.toString();
};

var browse = function(options) {
  var def = when.defer();
  var client = new SparqlClient(endpoint, reqOpt);
  var query = createQuery(options.q);
  console.log('query: %s', query);

  client
    .query(query)
    .bind('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>')
    .execute(function(error, results) {
      if (error)
        return def.reject(error);
      else
        return def.resolve(results);
    })

  return def.promise;
};

rdf = {
  browse: browse
};

module.exports = rdf;

