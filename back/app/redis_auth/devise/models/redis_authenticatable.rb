# Based on https://gist.github.com/madtrick/3916999
module Devise
  module Models
    module RedisAuthenticatable
      extend ActiveSupport::Concern

      module ClassMethods

        def serialize_from_session(id)
          User[id]
        end

        def serialize_into_session(user)
          [user.id]
        end
      end
    end
  end
end

