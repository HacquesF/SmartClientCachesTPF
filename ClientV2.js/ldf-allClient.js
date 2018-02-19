var ldf = require('ldf-client');
var fragmentsClient = new ldf.FragmentsClient('http://172.17.0.2:3000/scale1000');

var query = 'SELECT * {?s ?p ?o } LIMIT 10',
    results = new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient });
results.on('data', function (result) { console.log(result); });
