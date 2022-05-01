namespace :irpia do

  task :generate_sirene_yml do
    on roles(:app, :db) do
      string = File.read(File.expand_path('~/sirene.txt'))
      key = string.split(":")[0]
      secret = string.split(":")[1]
      db_config = StringIO.new(ERB.new(<<-EOF
#{fetch(:rails_env)}:
  key: #{key}
  secret: #{secret}
      EOF
      ).result(binding))
      execute :mkdir, "-p #{shared_path}/config"
      upload! db_config, "#{shared_path}/config/sirene.yml"
      execute :chmod, "644 #{shared_path}/config/sirene.yml"
    end
  end
end