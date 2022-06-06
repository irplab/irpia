namespace :data_utils do
  desc "TODO"

  task expand_levels: :environment do
    sparql_client = MetadataProcessor.new({}).send(:sparql_client)
    query = <<HEREDOC
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT * WHERE {
  {<http://data.education.fr/voc/scolomfr/concept/[value]> skos:broader ?sub.
    OPTIONAL {?sub skos:broader ?subsub. ?subsub skos:inScheme <http://data.education.fr/voc/scolomfr/scolomfr-voc-022>
    OPTIONAL {?subsub skos:broader ?subsubsub. ?subsubsub skos:inScheme <http://data.education.fr/voc/scolomfr/scolomfr-voc-022>
    OPTIONAL {?subsubsub skos:broader ?subsubsubsub. ?subsubsubsub skos:inScheme <http://data.education.fr/voc/scolomfr/scolomfr-voc-022>}}}}
  UNION {<http://data.education.fr/voc/scolomfr/concept/[value]> skos:related ?sub}
}
HEREDOC

label_query = <<HEREDOC
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT * WHERE 
  {<http://data.education.fr/voc/scolomfr/concept/[value]> skos:prefLabel ?label. BIND (STR(?label)  AS ?stripped_label) }
HEREDOC

    levels  = {
      'scolomfr-voc-022-num-004': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-005': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-006': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-007': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-010': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-011': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-013': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-014': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-015': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-018': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-020': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-021': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-023': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-608': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-129': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-131': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-132': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-133': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-134': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-135': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-136': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-138': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-201': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-043': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-044': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-047': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-048': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-049': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-083': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-212': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-027': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-089': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-090': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-213': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-095': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-096': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-097': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-098': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-153': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-154': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-099': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-100': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-103': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-104': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-288': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-298': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-231': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-125': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-126': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-238': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-640': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-641': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-650': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-139': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-146': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-150': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-151': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-185': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-187': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-101': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-102': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-111': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-112': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-109': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-110': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-163': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-164': {'edubases': [],
                                   'scolomfr': []},
      'scolomfr-voc-022-num-063': {'edubases': [],
                                   'scolomfr': []},
    }

    levels.each do |k, v|
      result = sparql_client.query(query.gsub('[value]', k.to_s));
      levels[k][:scolomfr] = ([k] + result.map do |r|
        r.to_h.values.map {|uri| uri.to_s.split('/').last}
      end).flatten.uniq
      label_result = sparql_client.query(label_query.gsub('[value]', k.to_s));
      levels[k][:label] = label_result.to_a.first['stripped_label'].to_s
    end
    puts levels.to_json
    end

  task classify_levels: :environment do
    sparql_client = MetadataProcessor.new({}).send(:sparql_client)

    levels_query = <<HEREDOC
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT * WHERE 
  {?level1 skos:inScheme <http://data.education.fr/voc/scolomfr/scolomfr-voc-022> .
FILTER EXISTS { <http://data.education.fr/voc/scolomfr/scolomfr-voc-022> skos:hasTopConcept  ?level1. }.
OPTIONAL {?level2 skos:broader ?level1.
OPTIONAL {?level3 skos:broader ?level2.
      OPTIONAL {?level4 skos:broader ?level3.
        OPTIONAL {?level5 skos:broader ?level4}}}}}
HEREDOC

    levels_result = sparql_client.query(levels_query);
    levels_hash = {level1: [],level2: [],level3: [],level4: []}
    levels_result.to_a.each do |level_result|
      levels_hash[:level1] << level_result.to_h[:level1].to_s
      levels_hash[:level2] << level_result.to_h[:level2].to_s
      levels_hash[:level3] << level_result.to_h[:level3].to_s
      levels_hash[:level4] << level_result.to_h[:level4].to_s
    end
    levels_hash.each { |k,v| levels_hash[k] = levels_hash[k].compact.uniq.sort }
    puts levels_hash.to_json
  end

end
