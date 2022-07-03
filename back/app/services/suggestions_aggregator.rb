class SuggestionsAggregator

  def aggregate(from:)
    Rails.application.config.modules.rules.each_with_object({}) do |pair, suggestions|
      suggestions[pair[0]] = aggregate_field(field: pair[0], rule: pair[1], threads: from)
    end
  end

  private

  def aggregate_field(field:, rule:, threads:)
    content = []
    rule.each do |module_keys|
      threads = module_keys.map do |module_key|
        thread_by_module_key(module_key, threads)
      end.compact
      threads.each do |thread|
        content.push(*thread_result_for_field(field, thread))
      end.flatten
      break unless content.blank?
    end
    content
  end

  def thread_result_for_field(field, thread)
    json = JSON.parse(thread.result || '{}')
    Array.wrap(json[field.to_s]).compact
  rescue StandardError => e
    # it's not json, probably an error message
    Rails.logger.error(e.message)
    []
  end

  def thread_by_module_key(module_key, threads)
    threads.filter do |thread|
      thread.key == module_key
    end.first
  end
end

