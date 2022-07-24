class MetadataProcessor

  include TripleStoreAccess

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


end

