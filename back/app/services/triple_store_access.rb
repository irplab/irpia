module TripleStoreAccess

  private

  def domain_entension_query
    <<HEREDOC
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX scolomfr: <https://www.reseau-canope.fr/scolomfr/ontologie#>
  PREFIX isothes: <http://purl.org/iso25964/skos-thes#>
  select distinct ?suggest_dom_in ?suggest_dom_in_label ?suggest_dom_out ?suggest_dom_out_label   
  where { 
    VALUES (?suggest_dom_in) 
      { (<http://data.education.fr/voc/scolomfr/concept/[value]>) }
  ?suggest_dom_in skos:prefLabel ?suggest_dom_in_label. 
  ?suggest_dom_in skos:narrower* ?suggest_dom_out.
  ?suggest_dom_out isothes:status ?status_suggest_dom_out.
  filter(regex(?status_suggest_dom_out, "Actuel", "i" ))
  ?suggest_dom_out skos:prefLabel ?suggest_dom_out_label.       
  } order by ?suggest_dom_out_label
HEREDOC
  end

  def broader_extension_query
    <<HEREDOC
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX scolomfr: <https://www.reseau-canope.fr/scolomfr/ontologie#>
  PREFIX isothes: <http://purl.org/iso25964/skos-thes#>
  select distinct ?concept ?concept_label ?parent_concept ?parent_concept_label   
  where { 
    VALUES (?concept) 
      { ( <[value]>) }
  ?concept skos:prefLabel ?concept_label. 
  OPTIONAL {
  ?concept skos:broader ?parent_concept.
  ?parent_concept isothes:status ?status_parent_concept.
  filter(regex(?status_parent_concept, "Actuel", "i" ))
  ?parent_concept skos:prefLabel ?parent_concept_label.     
  }
  } order by ?parent_concept_label
HEREDOC
  end

  def level_by_domain_query
    <<HEREDOC
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX scolomfr: <https://www.reseau-canope.fr/scolomfr/ontologie#>
select distinct ?domainLabel ?domain ?niveau ?niveauLabel
where { 
  VALUES (?domain) 
    { [values] }
   ?domain skos:prefLabel ?domainLabel.
  ?domain scolomfr:domaineEnseigneDansNiveau ?niveau.
  ?niveau skos:prefLabel ?niveauLabel.    
} order by ?domainLabel
HEREDOC
  end

  def sparql_client
    require 'sparql/client'
    SPARQL::Client.new(Rails.application.config.sparql[:uri])
  end
end
