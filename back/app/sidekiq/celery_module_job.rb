class CeleryModuleJob
  include Sidekiq::Job
  include Sidekiq::Status::Worker
  require 'open3'

  def perform(config, data)
    command = "cd #{Rails.root.join('celery_client')}; venv/bin/python3 client.py #{config['task']} #{Shellwords.escape(data['title'] || ' ')} #{Shellwords.escape(data['description'] || ' ')}"
    stdout, stderr, status = Open3.capture3("bash -c #{Shellwords.escape(command)}")
    Rails.logger.info(command)
    thread = SuggestionsThread.find({ job_id: @jid }).first
    if stdout.present?
      Rails.logger.info(stdout)
      thread.status = 'complete'
      thread.result = stdout
      thread.save
      thread.suggestion.save
    else
      Rails.logger.error(stderr)
      thread.status = 'error'
      thread.result = stderr
      thread.save
      thread.suggestion.save
    end
  end
end
