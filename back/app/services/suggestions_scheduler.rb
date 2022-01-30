class SuggestionsScheduler
  def init(with_params:)
    processed_params = MetadataProcessor.new.preprocess(with_params)
    suggestion = Suggestion.create
    Rails.application.config.modules.each { |key, config| suggestion.threads << suggestion_thread(config: config, data: processed_params, suggestion: suggestion) }
    suggestion
  end

  private

  def suggestion_thread(config:, data:, suggestion:)
    job_class = case config[:type]
                when 'cli'
                  CommandLineModuleJob
                end
    job_id = job_class.perform_async(config, data)
    SuggestionsThread.create(job_id: job_id, status: Sidekiq::Status::status(job_id), suggestion: suggestion)
  end
end

