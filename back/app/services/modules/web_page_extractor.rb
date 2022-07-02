class Modules::WebPageExtractor

  attr_accessor :result

  attr_accessor :status

  def call(data)
    unless data["url"].present?
      @result = {}.to_json
      @status = "success"
      return
    end
    extraction = find_or_create_extraction(data["url"].strip.downcase)

    @result = {
      title: ([extraction.title, extraction.best_title] + extraction.h1 + extraction.h2).uniq.compact,
      description: extraction.description,
      images: extraction.images
    }.to_json
    @status = "success"
  rescue StandardError => e
    @status = "error"
    @result = {
      error: e.message
    }.to_json
  end

  def find_or_create_extraction(url)
    page = WebPage.find({ url_hash: key(url) })
    return create_extraction(url) if page.empty?
    return page.first
  rescue Ohm::IndexNotFound
    return create_extraction(url)
  end

  def create_extraction(url)
    WebPage.create(mapping(MetaInspector.new(url), url))
  end

  def mapping(inspection, url)
    { url_hash: key(url),
      url: url,
      title: inspection.title,
      best_title: inspection.best_title,
      h1: inspection.h1,
      h2: inspection.h2,
      description: inspection.description,
      images: inspection.images.with_size
    }
  end

  def key(url)
    Digest::SHA256.hexdigest(url)
  end
end

