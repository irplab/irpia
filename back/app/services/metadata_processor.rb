class MetadataProcessor

  attr_accessor :metadata

  def initialize(metadata)
    @metadata = metadata
  end

  def preprocess
    self
  end

  def postprocess
    expand_domain
    self
  end

  private

  def expand_domain
    return unless @metadata[:domain].present?
    result = sparql_client.query(domain_entension_query.gsub('[value]', @metadata[:domain].first))
    @metadata[:domain] = @metadata[:domain].concat(result.map { |r| r[:suggest_dom_out].to_s.split('/').last }).uniq
  end

  def sparql_client
    require 'sparql/client'
    SPARQL::Client.new(Rails.application.config.sparql[:uri])
  end

  def domain_entension_query
    <<HEREDOC
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX scolomfr: <https://www.reseau-canope.fr/scolomfr/ontologie#>
  PREFIX isothes: <http://purl.org/iso25964/skos-thes#>
  select distinct ?suggest_dom_in ?suggest_dom_in_label ?suggest_dom_out ?suggest_dom_out_label   
  where { 
    VALUES (?suggest_dom_in) 
      { ( <http://data.education.fr/voc/scolomfr/concept/[value]>) }
  ?suggest_dom_in skos:prefLabel ?suggest_dom_in_label. 
  ?suggest_dom_in skos:narrower* ?suggest_dom_out.
  ?suggest_dom_out isothes:status ?status_suggest_dom_out.
  filter(regex(?status_suggest_dom_out, "Actuel", "i" ))
  ?suggest_dom_out skos:prefLabel ?suggest_dom_out_label.       
  } order by ?suggest_dom_out_label
HEREDOC
  end
end

