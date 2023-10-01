class Api::SireneClient

  require "erb"
  include ERB::Util

  # set variables
  BASE_URL = "https://api.insee.fr".freeze
  TOKEN_PATH = "/token".freeze
  SUGGESTION_PATH = "/entreprises/sirene/V3/siren".freeze
  AUTH_PARAMS = { grant_type: "client_credentials" }

  SOURCE_IDENTIFIER = "Sirène"

  def get_suggestions(query:, first_try: true)
    # 47.73 pharmacies
    # 68.20B SCI
    # 56.10 restaurants
    # 56.30Z débits de boissons
    # 86.21Z généralistes
    sectorExclusions = ["47.73Z", "68.20B", "56.10A", "56.10B", "56.10C", "56.30Z", "86.21Z"]
    formattedQuery = "#{query.split(/\s/).map { |word| "raisonSociale:#{word}*" }.join(' AND ')} AND -periode(#{sectorExclusions.map { |code| "activitePrincipaleUniteLegale:#{code}" }.join(' OR ')})"
    begin
      results = []
      response = connection.get SUGGESTION_PATH, { q: formattedQuery } do |request|
        request.headers["Authorization"] = "Bearer #{token}"
      end
      results = convert(JSON.parse(response.body)["unitesLegales"])
      results << { name: 'Aucun résultat Sirène', disabled: true, source: SOURCE_IDENTIFIER } if results.blank?
    rescue Faraday::ConnectionFailed => e
      Rails.logger.error e.message
      results << { name: 'Service Sirène indisponible' + ' : ' + e.message, disabled: true, identifier: 0, source: SOURCE_IDENTIFIER }
    rescue JSON::ParserError => e
      Rails.logger.error e.message
      results << { name: 'Réponse Sirène illisible' + ' : ' + e.message, disabled: true, identifier: 0, source: SOURCE_IDENTIFIER }
    rescue Faraday::Error => e
      Rails.logger.error e.inspect
      results << { name: 'Service Sirène en panne' + ' : ' + e.message, disabled: true, identifier: 0, source: SOURCE_IDENTIFIER }
    rescue StandardError => e
      Rails.logger.error e.message
      if first_try
        generate_token
        return get_suggestions(query: query, first_try: false)
      end
      results << { name: 'Erreur inconnue Sirène' + ' : ' + e.message, disabled: true, identifier: 0, source: SOURCE_IDENTIFIER }
    end
    results
  end

  def convert(results)
    (results || []).map { |result| { source: SOURCE_IDENTIFIER, name: result['periodesUniteLegale'][0]['denominationUniteLegale'], identifier: result['siren'] } }
  end

  SIRENE_TOKEN_NAME = 'sirene'

  def token
    token_record = Token.find(name: SIRENE_TOKEN_NAME)&.first
    if token_record.blank?
      token_record = generate_token
    end
    token_record.value
  end

  def generate_token
    response = connection.post TOKEN_PATH, AUTH_PARAMS do |request|
      request.headers["Authorization"] = "Basic " + Base64::encode64("#{Rails.application.config.sirene[:key]}:#{Rails.application.config.sirene[:secret]}").gsub("\n", '')
    end
    token = JSON.parse(response.body)['access_token']
    Token.find(name: SIRENE_TOKEN_NAME).map(&:delete)
    Token.create(name: SIRENE_TOKEN_NAME, value: token)
  end

  def connection
    Faraday.new(:url => BASE_URL) do |c|
      c.use Faraday::Request::UrlEncoded
      c.use Faraday::Response::Logger
      c.adapter Faraday::Adapter::NetHttp
      c.options.timeout = 10
      c.response :raise_error
    end
  end
end

