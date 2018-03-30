var SparqlParser = require('sparqljs').Parser,
    fs = require('fs'),
    path = require('path');
var args = require('minimist')(process.argv.slice(2));
var query = args.q;
const server= args.s;
    
//options = options || {};
//try {
   if (typeof query === 'string')
      query = new SparqlParser({}).parse(query);
   getBGP(query);
//}
//catch (error) {
// if (/Parse error/.test(error.message))
//   error = new InvalidQueryError(query, error);
// else
//   error = new UnsupportedQueryError(query, error);
// throw error;
//}
//Debug
function getBGP(query){
   if(query.type == 'query'){
      var arr = query.where;
   }else{
      var arr = query.patterns
   }
   
//   if(query.type == 'group'){
//      console.log(query);
//   }
   for (var i= 0; i<arr.length; ++i) {
      if(arr[i].type == 'bgp'){
         printURL(arr[i]); 
         //|| arr[i].type == 'optional'
      }else if(arr[i].type == 'union' || arr[i].type == 'group'){
         getBGP(arr[i]);
      }
   }
}

function charChange(str){
   str= str.replace(/\//g,'%2F');
   str= str.replace(/:/g,'%3A');
   str= str.replace(/#/g,'%23');
   return str;
}

function printURL(bgp){
   var arr = bgp.triples;
   var url= '',
   pat= /\?.*/;
   
   for(var i= 0; i< arr.length; ++i){
      if( !pat.test(arr[i].subject) ){
         arr[i].subject=charChange(arr[i].subject);
         url ='subject='+arr[i].subject;
      }
      if( !pat.test(arr[i].predicate)){
         arr[i].predicate=charChange(arr[i].predicate);
         (url != '') ? url += '&' : '';
         url +='predicate='+arr[i].predicate;
      }
      if( !pat.test(arr[i].object)){
         arr[i].object=charChange(arr[i].object);
         (url != '') ? url += '&' : '';
         url +='object='+arr[i].object;
      }
      if(url != ''){
         url = '?' + url;
      }
      console.log(server + url)
      url=''
   }
}


//TODO : Make loop in function for optional and UNION ot recurse in it looking for BGP
//Directly create the url every time you encounter a bgp
//Print it out directly or save into an array? (print easier)
