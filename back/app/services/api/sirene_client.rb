class Api::SireneClient

  # set variables
  BASE_URL = "https://api.insee.fr".freeze
  TOKEN_PATH = "/token".freeze
  SUGGESTION_PATH = "/entreprises/sirene/V3/siren".freeze
  AUTH_PARAMS = { grant_type: "client_credentials" }

  def get_suggestions(name:, first_try: true)
    params = { q: "periode(denominationUniteLegale:#{name}*)" }
    response = connection.get SUGGESTION_PATH, params do |request|
      request.headers["Authorization"] = "Bearer #{token}"
    end
    if response.status == 403
      Rails.logger.error("Access to Sirene API denied.")
      return []
    end
    if response.status == 401
      if first_try
        generate_token
        return get_suggestions(name: name, first_try: false)
      else
        Rails.logger.error("Unable to get data from sirene api with current credentials")
        return []
      end
    end
    convert(JSON.parse(response.body)["unitesLegales"])
  end

  def convert(results)
    results.map { |result| { source: "Sirène", name: result['periodesUniteLegale'][0]['denominationUniteLegale'], siren: result['siren'] } }
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
    Token.create(name: SIRENE_TOKEN_NAME, value: token)
  end

  def connection
    Faraday.new(:url => BASE_URL) do |c|
      c.use Faraday::Request::UrlEncoded
      c.use Faraday::Response::Logger
      c.adapter Faraday::Adapter::NetHttp
    end
  end
end

