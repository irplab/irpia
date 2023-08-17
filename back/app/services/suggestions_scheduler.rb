class SuggestionsScheduler
  def init(with_params:, authenticated: false)
    suggestion = Suggestion.create
    Rails.application.config.modules.modules.each do |key, config|
      next if config[:auth] && !authenticated
      suggestion.threads << suggestion_thread(key: key, config: config, data: with_params, suggestion: suggestion)
    end
    suggestion
  end

  private

  def suggestion_thread(key:, config:, data:, suggestion:)
    job_class = case config[:type]
                when 'cel'
                  CeleryModuleJob
                when 'api'
                  ApiModuleJob
                when 'cli'
                  CommandLineModuleJob
                when 'emb'
                  EmbeddedModuleJob
                end
    job_id = job_class.perform_async(config.stringify_keys, data.to_h)
    SuggestionsThread.create(key:, job_id: job_id, status: Sidekiq::Status::status(job_id), suggestion: suggestion)
  end

end

