namespace :deploy do
  namespace :check do
    before :linked_files, :set_master_key do
      on roles(:app), in: :sequence, wait: 10 do
        unless test("[ -f #{shared_path}/config/master.key ]")
          path = Pathname.new(File.join(__dir__))
          upload! "#{path}/../../../config/master.key", "#{shared_path}/config/master.key"
        end
      end
    end
  end
end