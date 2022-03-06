class EmbeddedModuleJob
  include Sidekiq::Job
  include Sidekiq::Status::Worker

  def perform(config, data)
    thread = SuggestionsThread.find({ job_id: @jid }).first
    service = "#{config['service']}".constantize.new
    begin
      service.call(data)
      case service.status
      when 'success'
        thread.status = 'complete'
        thread.result = service.result
      when 'error'
        thread.status = 'error'
        thread.result = service.result
      end
    rescue StandardError => e
      thread.status = 'error'
      thread.result = e.message
    ensure
      thread.save
      thread.suggestion.save
    end

  end
end
