var fs = require('fs');
var ldf = require('ldf-client');
ldf.Logger.setLevel('warning');

//Read queries file
const server = process.argv[2]
var file = fs.readFileSync(process.argv[3], 'utf8');
var queries = [];
queries = JSON.parse(file);
var nbQueries = process.argv[4];

queries = queries.slice(1, 2)

function execute(query) {
   return new Promise(resolve => {
      //var results = new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient })
	var fragmentsClient = new ldf.FragmentsClient(server);
	var result = new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })
	result.on('data', (res) => {
		//
	})
	result.on('end', () => {
		resolve()
	})
   })
}


queries.reduce((acc, query) => acc.then((globalResult) => {
	return new Promise((resolve, reject) => {
		return execute(query).then((res) => {
			return Promise.resolve([...globalResult, res])
		})
	})
	//	return execute(query)
}), Promise.resolve([])).then((finalResult) => {
	console.log('Finished', finalResult)
	
})



//      var results = new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient });


//results.on('data', function (result) { console.log(result); });
//source: https://stackoverflow.com/questions/17217736/while-loop-with-promises#17238793

