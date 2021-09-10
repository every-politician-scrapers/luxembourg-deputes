const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
  return `SELECT ?item ?name ?party ?group
         (STRAFTER(STR(?statement), '/statement/') AS ?psid)
    WHERE
    {
      ?item p:P39 ?statement .
      ?statement ps:P39 wd:${meta.legislature.member} ; pq:P2937 wd:${meta.legislature.term.id} .
      FILTER NOT EXISTS { ?statement pq:P582 ?end }

      OPTIONAL {
        ?item wdt:P102 ?party .
        OPTIONAL { ?party wdt:P1813 ?partyShort FILTER (LANG(?partyShort) = '${meta.source.lang.code}')}
        OPTIONAL { ?party rdfs:label ?partyName FILTER (LANG(?partyName) = '${meta.source.lang.code}')}
        BIND(COALESCE(?partyShort, ?partyName) as ?group)
      }

      OPTIONAL {
        ?statement prov:wasDerivedFrom ?ref .
        ?ref pr:P854 ?source FILTER CONTAINS(STR(?source), '${meta.source.url}')
        OPTIONAL { ?ref pr:P1810 ?sourceName }
      }
      OPTIONAL { ?item rdfs:label ?wdLabel FILTER(LANG(?wdLabel) = "${meta.source.lang.code}") }
      BIND(COALESCE(?sourceName, ?wdLabel) AS ?name)
    }
    ORDER BY ?item`
}
