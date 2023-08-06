require 'bcrypt'

module Devise
  module Strategies
    # The class needs to inherit from Devise::Strategies::Authenticatable which
    # implements most of the underlying logic for auth strategies in Devise.
    # You can read the code here:
    # https://github.com/heartcombo/devise/blob/main/lib/devise/strategies/authenticatable.rb
    class RedisAuthenticatable < Authenticatable

      include BCrypt
      # This is the method called by Warden to authenticate a user.
      # More info in https://github.com/wardencommunity/warden/wiki/Strategies#authenticate
      def authenticate!
        if credentials_valid?
          # Signals Warden that the authentication was successful.
          # Expects an instance of the model class that Devise is configured to work with.
          # This should be the user account that matches the provided credentials.
          success!(validated_user)
        else
          # Signals Warden that the authentication failed.
          fail!
        end
      end

      private

      def credentials_valid?
        User.by_email(authentication_hash[:email]).password == authentication_hash[:password]
      end

      def validated_user
        User.by_email(authentication_hash[:email])
      end
    end
  end
end
