class Serialization::Scolomfr

  def to_xml(notice)
    doc = File.open(Rails.root.join('etc', 'scolomfr', 'blank.xml')) { |f| Nokogiri::XML(f) }
    fillTitle(doc, notice)
    fillDescription(doc, notice)
    doc
  end

  private

  def fillTitle(doc, notice)
    title_str = notice['title']
    title_elem  = doc.at_xpath "lom:lom/lom:general/lom:title/lom:string"
    title_elem.content = title_str
    language = detect_language(title_str)
    title_elem['language'] = language if language
  end

  def fillDescription(doc, notice)
    description_str = notice['description']
    description_elem  = doc.at_xpath "lom:lom/lom:general/lom:description/lom:string"
    description_elem.content = description_str
    language = detect_language(description_str)
    description_elem['language'] = language if language
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
