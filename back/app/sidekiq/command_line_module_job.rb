class CommandLineModuleJob
  include Sidekiq::Job
  include Sidekiq::Status::Worker
  require 'open3'

  def perform(config, data)
    params = data.map {|k,v|  "--#{k} \"#{v}\""}
    command = "cd #{Rails.application.config.batch_modules_dir}#{config['dir']}; #{config['exec']} #{config['args']&.join(' ')} #{params&.join(' ')}"
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
