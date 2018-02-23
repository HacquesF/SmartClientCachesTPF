var fs = require('fs');
var ldf = require('ldf-client');
var fragmentsClient = new ldf.FragmentsClient(process.argv[2]);
ldf.Logger.setLevel('warning');
//fragmentsClient._cache = new Cache({ max: 0 });

//Read queries file
var file = fs.readFileSync(process.argv[3]);
var queries = [];
queries = JSON.parse(file);
var nbQueries = process.argv[4];

function getResult(value) {
   return new Promise(resolve => {
      //var results = new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient })
      resolve(new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient }))
   })
}
function loop(value){
   
      getResult(value).then(() => {
         if (value < nbQueries){
            console.log(value)
            return loop(value+1)
         }else{
            console.log('done')
         }
      })
}
loop(0)
//      var results = new ldf.SparqlIterator(queries[value], { fragmentsClient: fragmentsClient });


//results.on('data', function (result) { console.log(result); });
//source: https://stackoverflow.com/questions/17217736/while-loop-with-promises#17238793

