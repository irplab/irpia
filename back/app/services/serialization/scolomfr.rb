class Serialization::Scolomfr

  attr_accessor :doc

  def initialize(notice)
    @notice = notice
    @doc = File.open(Rails.root.join('etc', 'scolomfr', 'blank.xml')) { |f| Nokogiri::XML(f) }
  end

  def call
    fillTitle
    fillDescription
    fillContributors
    fillTechnicalLocation
    fillDocumentType
    fillEducationalResourceType
    self
  end

  private

  def fillTitle
    title_str = @notice['title']
    title_elem  = @doc.at_xpath "lom:lom/lom:general/lom:title/lom:string"
    title_elem.content = title_str
    language = detect_language(title_str)
    title_elem['language'] = language if language
  end

  def fillDescription
    description_str = @notice['description']
    description_elem  = @doc.at_xpath "lom:lom/lom:general/lom:description/lom:string"
    description_elem.content = description_str
    language = detect_language(description_str)
    description_elem['language'] = language if language
  end

  def fillTechnicalLocation
    url = @notice['url']
    location_elem  = @doc.at_xpath "lom:lom/lom:technical/lom:location"
    location_elem.content = url
  end

  def fillContributors
    life_cycle_node = @doc.at_xpath 'lom:lom/lom:lifeCycle'
    contributor_node_template = @doc.at_xpath 'lom:lom/lom:lifeCycle/lom:contribute'
    contributor_node_template.remove
    @notice['contributors']['list'].each do |contributor|
      vcard = create_vcard(contributor)
      contributor_node = contributor_node_template.dup(1)
      role_value_node = contributor_node.at_xpath 'lom:role/lom:value'
      role_value_node.content = "http://data.education.fr/voc/scolomfr/concept/#{contributor['contributor_role']}" if contributor.has_key?('contributor_role')
      role_label_node = contributor_node.at_xpath 'lom:role/lom:label'
      role_label_node.content = contributor['contributor_role_label'] if contributor.has_key?('contributor_role_label')
      date_node = contributor_node.at_xpath 'lom:date/lom:dateTime'
      date_node.content = Date.today
      entity_node = contributor_node.at_xpath 'lom:entity'
      cdata = @doc.create_cdata(vcard.to_s.strip)
      entity_node.add_child(cdata)
      life_cycle_node.add_child(contributor_node)
    end
  end

  def fillDocumentType
    generalNode = @doc.at_xpath 'lom:lom/lom:general'
    document_type_node_template = @doc.at_xpath 'lom:lom/lom:general/lomfr:documentType'
    document_type_node_template.remove
    (@notice['document_type_id'] || []).each_with_index do |document_type_id, index|
      document_type_node = document_type_node_template.dup(1)
      document_type_value_node = document_type_node.at_xpath 'lomfr:value'
      document_type_value_node.content = document_type_id
      document_type_label_node = document_type_node.at_xpath 'lomfr:label'
      document_type_label_node.content = @notice['document_type_label'][index] if @notice['document_type_label'][index]
      generalNode.add_child(document_type_node)
    end
  end

  def fillEducationalResourceType
    educationalNode = @doc.at_xpath 'lom:lom/lom:educational'
    learning_resource_type_node_template = @doc.at_xpath 'lom:lom/lom:educational/lom:learningResourceType'
    learning_resource_type_node_template.remove
    (@notice['educational_resource_type_id'] || []).each_with_index do |learning_resource_type_id, index|
      learning_resource_type_node = learning_resource_type_node_template.dup(1)
      learning_resource_type_value_node = learning_resource_type_node.at_xpath 'lom:value'
      learning_resource_type_value_node.content = "http://data.education.fr/voc/scolomfr/concept/#{learning_resource_type_id}"
      learning_resource_type_label_node = learning_resource_type_node.at_xpath 'lom:label'
      learning_resource_type_label_node.content = @notice['educational_resource_type_label'][index] if @notice['educational_resource_type_label'][index]
      educationalNode.add_child(learning_resource_type_node)
    end
  end

  def create_vcard(contributor)
    vcard = VCardigan.create(:version => '4.0')
    vcard.kind 'ORG'
    vcard.revision Date.today
    if contributor.has_key?('contributor_name')
      vcard.fullname(contributor['contributor_name'])
      vcard.org(contributor['contributor_name'])
    end
    siren = contributor["custom_siren"] || contributor&.dig("selected_siren_info")&.dig("identifier")
    vcard.note "SIREN=#{siren}" if siren.present?
    isni = contributor["custom_isni"] || contributor&.dig("selected_isni_info")&.dig("identifier")
    vcard.note "ISNI=#{isni}" if isni.present?
    if contributor.has_key?('contributor_phone_number')
      phone_number = contributor['contributor_phone_number']
      phone_number = phone_number.gsub(/\+(\d\d)\s/, '(\1)').gsub(/\s/, '-').gsub(/\)/, ') ')
      vcard.tel phone_number
    end
    vcard
  end

  def detect_language str
    lang_obj = CLD.detect_language(str)
    code = lang_obj[:code]
    if code == 'un'
      return nil
    end
    ISO_639.find_by_code(code).alpha3
  end

end
