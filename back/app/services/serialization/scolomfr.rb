class Serialization::Scolomfr

  attr_accessor :doc

  include TripleStoreAccess

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
    fillEducationalLevel
    fillDomain
    fillThumbnail
    self
  end

  private

  def fillTitle
    title_str = @notice['title']
    title_elem = @doc.at_xpath "lom:lom/lom:general/lom:title/lom:string"
    title_elem.content = title_str
    language = detect_language(title_str)
    title_elem['language'] = language if language
  end

  def fillDescription
    description_str = @notice['description']
    description_elem = @doc.at_xpath "lom:lom/lom:general/lom:description/lom:string"
    description_elem.content = description_str
    language = detect_language(description_str)
    description_elem['language'] = language if language
  end

  def fillTechnicalLocation
    url = @notice['url']
    location_elem = @doc.at_xpath "lom:lom/lom:technical/lom:location"
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
    end
    if contributor.has_key?('editorial_brand')
      vcard.org(contributor['editorial_brand'])
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

  def fillThumbnail
    thumbnail_url = @notice['thumbnail_url']
    relation_elem = @doc.at_xpath "lom:lom/lom:relation"
    thumbnail_url_elem = @doc.at_xpath "lom:lom/lom:relation/lom:resource/lom:identifier/lom:entry"
    if thumbnail_url.present?
      thumbnail_url_elem.content = thumbnail_url
    else
      relation_elem.remove
    end
  end

  def fillEducationalLevel
    fillClassification("level", 'http://data.education.fr/voc/scolomfr/concept/educational_level')
  end

  def fillDomain
    fillClassification("domain", 'http://data.education.fr/voc/scolomfr/concept/scolomfr-voc-028-num-003')
  end

  def fillClassification(field, classification_uri)
    classification_node = @doc.at_xpath "lom:lom/lom:classification[./lom:purpose[.//lom:value[contains(text(),'#{classification_uri}')]]]"
    unless @notice[field].present?
      classification_node.remove
      return
    end
    parents = Hash.new
    found_in_hierarchy = []
    @notice[field].map do |concept|
      parents[concept] = []
      child_concept = "http://data.education.fr/voc/scolomfr/concept/#{concept}"
      while child_concept
        result = sparql_client.query(broader_extension_query.gsub('[value]', child_concept))
        break if result.count == 0
        concept_hash ||= { uri: result.first[:concept].to_s, label: result.first[:concept_label].to_s }
        break unless result.first[:parent_concept]
        found_in_hierarchy << result.first[:parent_concept].to_s
        (parents[concept] ||= []).unshift(uri: result.first[:parent_concept].to_s, label: result.first[:parent_concept_label].to_s)
        child_concept = result.first[:parent_concept].to_s
      end
      parents[concept] << concept_hash if parents[concept]
    end
    found_in_hierarchy.flatten.uniq.each { |key| parents.delete(key.to_s.split("/").last) }
    taxon_path_node_template = classification_node.at_xpath 'lom:taxonPath'
    taxon_path_node_template.remove
    taxon_node_template = taxon_path_node_template.at_xpath 'lom:taxon'
    taxon_node_template.remove
    parents.each do |key, elements|
      taxon_path_node = taxon_path_node_template.dup(1)
      elements.each do |element|
        taxon_node = taxon_node_template.dup(1)
        id_elem = taxon_node.at_xpath "lom:id"
        id_elem.content = element[:uri]
        entry_elem = taxon_node.at_xpath "lom:entry/lom:string"
        entry_elem.content = element[:label]
        taxon_path_node.add_child(taxon_node)
      end
      classification_node.add_child(taxon_path_node)
    end
    classification_node.remove if parents.keys.blank?
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
