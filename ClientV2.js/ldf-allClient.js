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
//blist = activate blacklist for big queries
//res = output res in 1
//t = timeout in ms
//Set up args

var argv = require('minimist')(process.argv.slice(2));
//console.dir(argv);

const server = argv._;
var timeONb = 0;
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
   queries = queries.slice(startQuerie, nbQueries);
   if(argv.blist){
      blacklist = [9,12,34,37,59,62,84,87,109,112,134,137,159,161,183,186]
      //Remove before to get same workload
      var found = blacklist.findIndex(function(element) {
         return element >= startQuerie;
      });
      next=blacklist[found]
      for(var i=1;next<nbQueries;++i){
         queries.splice(next-startQuerie,1)
         next=blacklist[i]-i
      }
   }
   
}

function execute(query) {
   return new Promise(resolve => {
      //var results = new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient })
      var start= Date.now();
      var to=false
	   var fragmentsClient = new ldf.FragmentsClient(server,{ concurrentRequests: argv.h || 10 });
	   fragmentsClient._cache = new Cache({ max: argv.c || 100 });
	   var result = new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient });
	
	   if(argv.t){
	      timeO=setTimeout(function(){
            timeONb +=1
            to=true
            fragmentsClient.abortAll();
            result.close()
	      }, argv.t);
	   }
	   result.on('data', (res) => {
		   //
		   if(argv.res){
		      console.log(res);
		   }
   //		var millis = Date.now() - start;
   //		if(millis > argv.t){
   // 	      console.log('Timed out');
   //	      fragmentsClient.abortAll();  
   //		}
		
	   })
	   result.on('end', () => {
	      //console.log('done')
	      if(argv.t && !to){
	         clearTimeout(timeO);
	      }
	      if(argv.res){
		      console.log(']');
		   }
	      console.log("'Time': ", (Date.now() - start))
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
   if(argv.res){
      console.log('[');
	}
	return execute(query)
}), Promise.resolve([])).then((finalResult) => {
//   process.stdout.write("]\n");
	//console.log('Finished', finalResult)
	if(argv.t){
	   console.log("'Timeouts': ", timeONb);
	}
})



//      var results = new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient });


