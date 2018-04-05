var fs = require('fs');
var ldf = require('ldf-client');
var Cache = require('lru-cache');

//e = id of last queries
//s = id of first queries
//n = name of file
//q = string querie
//l = type of log
//c = max cache size
//h = number of concurrent request
//Set up args
var argv = require('minimist')(process.argv.slice(2));
//console.dir(argv);

const server = argv._;

//Set up log level
   ldf.Logger.setLevel(argv.l || 'warning');

//Read queries file
//const server = process.argv[2]
var queries = [argv.q] || [];

if(argv.n){
   const fileName = argv.n;
   //If no args, just the first one
   const nbQueries = argv.e || 1;
   const startQuerie = argv.s || 0;
   var file = fs.readFileSync(fileName, 'utf8');
   queries = JSON.parse(file);
   queries = queries.slice(startQuerie, nbQueries)
}

function execute(query) {
   return new Promise(resolve => {
      //var results = new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient })
	var fragmentsClient = new ldf.FragmentsClient(server,{ concurrentRequests: argv.h || 10 });
	fragmentsClient._cache = new Cache({ max: argv.c || 100 });
	var result = new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })
	result.on('data', (res) => {
		//
	})
	result.on('end', () => {
	   //console.log('done')
		resolve()
	})
   })
}

//process.stdout.write("[");
queries.reduce((acc, query) => acc.then((globalResult) => {
//	return new Promise((resolve, reject) => {
//		return execute(query).then((res) => {
//			return Promise.resolve([...globalResult, res])
//		})
//	})
//   process.stdout.write("#");
	return execute(query)
}), Promise.resolve([])).then((finalResult) => {
//   process.stdout.write("]\n");
	//console.log('Finished', finalResult)
	
})



//      var results = new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient });


