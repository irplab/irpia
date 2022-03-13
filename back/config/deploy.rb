# config valid for current version and patch releases of Capistrano
lock "~> 3.16.0"

set :application, "irpia"
set :repo_url, "git@github.com:irplab/irpia.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/home/#{fetch :application}/api"

# set :branch, :'request-workflow'
set :branch, :'main'

set :repo_tree, :back

Rake::Task['deploy:assets:precompile'].clear_actions
Rake::Task['deploy:assets:backup_manifest'].clear_actions
Rake::Task['deploy:cleanup_assets'].clear_actions
Rake::Task['deploy:migrate'].clear_actions

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, "config/sparql.yml", "config/sidekiq.yml"

# Default value for linked_dirs is []
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', '.bundle', 'public'

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
#
set :env_file, ".env.production"
set :ignored_env_vars, %w(
BUNDLE_GEMFILE
REDIS_URL
RAILS_MAX_THREADS
USER
RAILS_MASTER_KEY
RAILS_SERVE_STATIC_FILES
RAILS_LOG_TO_STDOUT
CI
RAILS_MIN_THREADS
RAILS_ENV
PORT
PIDFILE
WEB_CONCURRENCY
)

namespace :deploy do
  after :finished, 'dotenv:read'
  after :finished, 'dotenv:check'
  after :finished, 'dotenv:setup'
end

