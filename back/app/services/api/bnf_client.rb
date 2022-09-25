class Api::BnfClient

  BNF_SRU_HOST = 'http://catalogue.bnf.fr'
  BNF_SRU_PATH = '/api/SRU?version=1.2&operation=searchRetrieve&query=(aut.type%20any%20%22org%22)%20and%20(aut.accesspoint%20all%20%22$QUERY*%22)&startRecord=1&maximumRecords=$ROWS'
  DEFAULT_ROWS = 20
  SOURCE_IDENTIFIER = 'ISNI'

  def get_suggestions(query:, reference_type: 'person')
    results = []
    begin
      unless query.blank?
        path = BNF_SRU_PATH.gsub('$QUERY', URI.encode_www_form_component(query)).gsub('$ROWS', DEFAULT_ROWS.to_s)
        results = get_results(path)
      end
      results << { name: 'Aucun résultat ISNI', disabled: true, source: SOURCE_IDENTIFIER } if results.blank?
    rescue Faraday::ConnectionFailed => e
      Rails.logger.error e.message
      results << { name: 'Service BNF indisponible' + ' : ' + e.message, disabled: true, identifier: 0, source: SOURCE_IDENTIFIER } if results.blank?
    rescue JSON::ParserError => e
      Rails.logger.error e.message
      results << { name: 'Réponse BNF illisible' + ' : ' + e.message, disabled: true, identifier: 0, source: SOURCE_IDENTIFIER } if results.blank?
    rescue StandardError => e
      Rails.logger.error e.message
      results << { name: 'Erreur inconnue BNF' + ' : ' + e.message, disabled: true, identifier: 0, source: SOURCE_IDENTIFIER } if results.blank?
    end
    results.compact
  end

  private

  def get_results(path)
    Rails.logger.debug "BNF API called : #{BNF_SRU_HOST}/#{path}"
    response = isni_sru_connexion.get *path
    doc = Nokogiri.parse(response.body)
    doc.remove_namespaces!
    organisations = doc.xpath('//record').select do |record|
      record.xpath("datafield[@tag = '010']/subfield[@code ='2']/text()").text() == "ISNI"
    end
    organisations.compact.map do |org|
      hash = {}
      hash[:source] = SOURCE_IDENTIFIER
      hash[:name] = org.xpath("datafield[@tag = '110' or @tag = '210' or @tag = '410']/subfield[@code ='a']/text()").map(&:text).flatten.uniq.join(", ")
      hash[:identifier] = org.xpath("datafield[@tag = '010']/subfield[@code ='a']/text()").text()
      hash[:type] = org.xpath("datafield[@tag = '300']/subfield[@code ='a']/text()").map(&:text).flatten.uniq.join(", ")
      hash
    end
  end

  def isni_sru_connexion
    Faraday.new(:url => BNF_SRU_HOST) { |conn|
      conn.adapter :net_http
      conn.options.timeout = 10
      conn.response :raise_error
    }
  end

end
