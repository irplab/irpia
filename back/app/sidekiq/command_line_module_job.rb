class CommandLineModuleJob
  include Sidekiq::Job
  include Sidekiq::Status::Worker
  require 'open3'

  def perform(config, data)
    params = data.map {|k,v|  "--#{k} \"#{v}\""}
    command = "cd #{Rails.application.config.batch_modules_dir}#{config['dir']}; #{config['exec']} #{config['args']&.join(' ')} #{params&.join(' ')}"
    stdout, stderr, status = Open3.capture3("bash -c #{Shellwords.escape(command)}")
    Rails.logger.error(stdout, stderr, status)
    thread = SuggestionsThread.find({ job_id: @jid }).first
    if stdout.present?
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
