class Modules::LevelDeducer

  include TripleStoreAccess

  attr_accessor :result

  attr_accessor :status

  def call(data)
    unless data["domain"].present?
      @result = {}.to_json
      @status = "success"
      return
    end
    levels = deduce_level(data["domain"])

    @result = {
      level: levels
    }.to_json
    @status = "success"
  rescue StandardError => e
    @status = "error"
    @result = {
      error: e.message
    }.to_json
  end

  def deduce_level(domains)
    result = sparql_client.query(level_by_domain_query.gsub('[values]', domains.map { |domain| "(<http://data.education.fr/voc/scolomfr/concept/#{domain}>)" }.join(" ")))
    return result.map(&:niveau).map(&:value).map { |uri| uri.split('/').last }
  end

end

