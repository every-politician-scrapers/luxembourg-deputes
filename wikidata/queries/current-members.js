const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
  return `SELECT ?item ?name ?party ?group ?district ?constituency ?start
         (STRAFTER(STR(?statement), '/statement/') AS ?psid)
    WHERE
    {
      ?item p:P39 ?statement .
      ?statement ps:P39 wd:${meta.legislature.member} ; pq:P2937 wd:${meta.legislature.term.id} .
      OPTIONAL { ?statement pq:P580 ?start }
      FILTER NOT EXISTS { ?statement pq:P582 ?end }
      OPTIONAL { ?statement pq:P768 ?district }
      OPTIONAL { ?statement pq:P4100 ?party }
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "fr,en". 
        ?item rdfs:label ?name .
        ?party rdfs:label ?group .
        ?district rdfs:label ?constituency .
      }
    }
    ORDER BY ?item`
}
