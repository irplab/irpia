class Api::IsniClient

  ISNI_SRU_HOST = 'http://isni.oclc.org'
  ISNI_SRU_PATH = '/sru/DB=1.2/?query=pica.na+%3D+"$QUERY"&version=1.1&operation=searchRetrieve&recordSchema=isni-b&maximumRecords=$ROWS&startRecord=1&recordPacking=xml&sortKeys=none&x-info-5-mg-requestGroupings=none&x-info-5-mh-requestHints=*'
  DEFAULT_ROWS = 100
  SOURCE_IDENTIFIER = 'ISNI'

  def get_suggestions(query:, reference_type: 'person')
    results = []
    begin
      unless query.blank?
        path = ISNI_SRU_PATH.gsub('$QUERY', query).gsub('$ROWS', DEFAULT_ROWS.to_s)
        results = get_results(path)
      end
      results << { name: 'Aucun résultat ISNI', identifier: 0, source: SOURCE_IDENTIFIER } if results.blank?
    rescue Faraday::ConnectionFailed => e
      Rails.logger.error e.message
      results << { name: 'Service ISNI indisponible' + ' : ' + e.message, identifier: 0, source: SOURCE_IDENTIFIER } if results.blank?
    rescue JSON::ParserError => e
      Rails.logger.error e.message
      results << { name: 'Réponse ISNI illisible' + ' : ' + e.message, identifier: 0, source: SOURCE_IDENTIFIER } if results.blank?
    rescue StandardError => e
      Rails.logger.error e.message
      results << { name: 'Erreur inconnue ISNI' + ' : ' + e.message, identifier: 0, source: SOURCE_IDENTIFIER } if results.blank?
    end
    results.compact
  end

  private

  def get_results(path)
    Rails.logger.debug "Isni called : #{ISNI_SRU_HOST}/#{path}"
    response = isni_sru_connexion.get *path
    organisations = Nokogiri.parse(response.body).xpath('//responseRecord').select do |record|
      record.xpath("ISNIAssigned/ISNIMetadata/identity/organisation").count > 0
    end
    organisations.compact.map do |org|
      hash = {}
      hash[:name] = org.xpath("ISNIAssigned/ISNIMetadata/identity/organisation/organisationName/mainName/text()").map(&:text).flatten.uniq.sort_by(&:length).join(" / ")
      hash[:identifier] = org.xpath("ISNIAssigned/isniUnformatted/text()").first&.text()
      hash[:source] = SOURCE_IDENTIFIER
      hash[:type] = org.xpath("ISNIAssigned/ISNIMetadata/identity/organisation/organisationType/text()").first&.text()
      hash
    end
  end

  def isni_sru_connexion
    Faraday.new(:url => ISNI_SRU_HOST) { |conn|
      conn.adapter :net_http
    }
  end

end
