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

  def format_images(images)
    return [] if images.blank?
    images.map { |image| { src: image[0], width: image[1], height: image[2] } }
  end

  def mapping(inspection, url)
    { url_hash: key(url),
      url: url,
      title: normalize_spaces(inspection.title),
      best_title: normalize_spaces(inspection.best_title),
      h1: normalize_spaces(inspection.h1),
      h2: normalize_spaces(inspection.h2),
      description: normalize_spaces(inspection.description),
      images: format_images(inspection.images.with_size)
    }
  end

  def key(url)
    Digest::SHA256.hexdigest(url)
  end

  private

  def normalize_spaces(string)
    return string unless string.respond_to?(:gsub)
    string.gsub(/\s+/, " ")
  end
end

