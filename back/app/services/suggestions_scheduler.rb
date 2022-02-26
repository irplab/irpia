class SuggestionsScheduler
  def init(with_params:)
    suggestion = Suggestion.create
    Rails.application.config.modules.modules.each { |key, config| suggestion.threads << suggestion_thread(key: key, config: config, data: with_params, suggestion: suggestion) }
    suggestion
  end

  private

  def suggestion_thread(key:, config:, data:, suggestion:)
    job_class = case config[:type]
                when 'cli'
                  CommandLineModuleJob
                end
    job_id = job_class.perform_async(config, data.to_h)
    SuggestionsThread.create(key:, job_id: job_id, status: Sidekiq::Status::status(job_id), suggestion: suggestion)
  end

end

