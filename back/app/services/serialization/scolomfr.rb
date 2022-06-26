class Serialization::Scolomfr

  def to_xml(notice)
    doc = File.open(Rails.root.join('etc', 'scolomfr', 'blank.xml')) { |f| Nokogiri::XML(f) }
    doc
  end

  private

end
