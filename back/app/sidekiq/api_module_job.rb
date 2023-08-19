class ApiModuleJob
  include Sidekiq::Job
  include Sidekiq::Status::Worker
  require 'httparty'

  def perform(config, data)
    response = HTTParty.post("#{ENV['IRPIA_PROMP_HOST']}#{config['path']}",
                             body: { title: data['title'] || ' ', description: data['description'] || ' ' }.to_json,
                             headers: { "Content-Type": "application/json" })
    thread = SuggestionsThread.find({ job_id: @jid }).first
    if response.success?
      Rails.logger.info(response.body)
      thread.status = 'complete'
      thread.result = response.body
      thread.save
      thread.suggestion.save
    else
      Rails.logger.error(response.body)
      thread.status = 'error'
      thread.result = response.message
      thread.save
      thread.suggestion.save
    end
  end
end
