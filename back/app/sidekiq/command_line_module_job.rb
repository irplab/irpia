class CommandLineModuleJob
  include Sidekiq::Job
  include Sidekiq::Status::Worker
  require 'open3'

  def perform(config, data)
    command = "cd #{Rails.application.config.batch_modules_dir}; #{config["exec"] } #{config["args"]&.join(' ')}"
    stdout, stderr, status = Open3.capture3("bash -c #{Shellwords.escape(command)}")
    thread = SuggestionsThread.find({ job_id: @jid }).first
    if stderr.blank?
      thread.status = 'complete'
      thread.result = stdout
      thread.save
      thread.suggestion.save
    else
      thread.status = 'error'
      thread.result = stderr
      thread.save
      thread.suggestion.save
    end
  end
end
