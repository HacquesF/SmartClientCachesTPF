//EXE: docker run --name ldf-clientcache -v $(pwd)/../zip/queries/scale1000_queries.json:/tmp/queries.json ldf-clientcache http://172.17.0.2:3000/scale1000 -l info -n /tmp/queries.json -e 2

var fs = require('fs');
var ldf = require('../ldf-client');
var Cache = require('lru-cache');
var SparqlParser = require('sparqljs').Parser;
var _ = require('lodash'),
   FragClient = require('../lib/triple-pattern-fragments/FragmentsClient'),
   rdf = require('../lib/util/RdfUtil');

var logger = require('../lib/util/Logger')
//e = id of last queries
//s = id of first queries
//n = name of file
//q = string querie
//l = type of log
//c = max cache size
//Set up args
var argv = require('minimist')(process.argv.slice(2));
//console.dir(argv);

const server = argv._;
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

//---------------Filling CacheGen
//Getting triples
var tripPres = new Set();
for(const q of queries){
   getBGP(new SparqlParser({}).parse(q)).forEach(t => tripPres.add(t));
}
//Find BGP in query and return triples in a set
function getBGP(query){
   var tripRes = new Set();
   if(query.type == 'query'){
      var arr = query.where;
   }else{
      var arr = query.patterns
   }
   for (var i= 0; i<arr.length; ++i) {
      if(arr[i].type == 'bgp'){
         addTriple(arr[i]).forEach(t => tripRes.add(t));
      }else if(arr[i].type == 'union' || arr[i].type == 'group'){
         getBGP(arr[i]);
      }
   }
   return tripRes
}
//Exteact triples from bgp into a set
function addTriple(bgp){
   var tripRes = new Set();
   var arr = bgp.triples;
   for(let trip of arr){
      tripRes.add(rdf.triple(trip.subject,trip.predicate,trip.object));
   }
   return tripRes
}
//Putting triples in CacheGen
var CacheGen = new Cache( {max: tripPres.size, stale: true});
function fillCache() {
   return new Promise(resolve => {
      var fgClient = new ldf.FragmentsClient(server, {logger: logger('HttpCache')});
//      //Filling CacheGen
      for(let pattern of tripPres){
         var key = JSON.stringify(pattern);
         var frag = fgClient.getOnlyFragmentByPattern(pattern);
         CacheGen.set(key, frag);
      }
      resolve()
      
//      var ite = tripPres.values();
//      loopIte(ite,fgClient).then(function (){
//         resolve();
//      })
   })
}
//function loopIte(ite, fgClient){
//   return new Promise(resolve => {
//   console.log('CCCBBBB');
//      t = ite.next().value;
//      if(t != undefined){
//         addT(t,fgClient).then(function (){
//            loopIte(ite,fgClient).then(function (){
//               resolve();
//            })
//         });
//      }else{
//      console.log('BBBBBBBB');
//         resolve();
//      }
//   })
//}

//function addT(t, fgClient){
//   return new Promise (resolve => {
//      var key = JSON.stringify(t);
//      var frag = fgClient.getFragmentByPattern(t);
//      CacheGen.set(key, frag);
//      frag.on('end', ()=>{
//         console.log('AAA');
//         resolve();
//      })
//   })
//}
//Set up log level
   
function execute(query) {
   return new Promise(resolve => {
	   var fragmentsClient = new ldf.FragmentsClient(server);
	   fragmentsClient._cache = new Cache({ max: argv.c || 100 });
	   fragmentsClient._cacheGen = CacheGen;
	   var result = new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })
	   result.on('data', (res) => {
		   //
	   })
	   result.on('end', () => {
		   resolve()
	   })
   })
}

fillCache().then(() => {
   console.log(queries);
   queries.reduce((acc, query) => acc.then((globalResult) => {
	   return execute(query)
   }), Promise.resolve([])).then((finalResult) => {

   })
})


