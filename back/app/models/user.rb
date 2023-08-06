require 'bcrypt'

class User < Ohm::Model

  include ActiveModel::API
  include ActiveModel::Validations
  extend ActiveModel::Callbacks
  extend Devise::Models

  define_model_callbacks :validation

  def serializable_hash(options = nil)
    self.to_hash
  end

  attribute :email
  unique :email
  attribute :encrypted_password

  include BCrypt

  def password
    @password ||= (encrypted_password ? Password.new(encrypted_password) : nil)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.encrypted_password = @password
  end

  index :email

  devise :redis_authenticatable, authentication_keys: [:email, :password]

  attr_writer :id

  def self.by_email(email)
    # avoid undefined method "[]" error
    user_ids = User.find(email: email).ids
    return nil unless user_ids.count == 1
    User[user_ids.first]
  end

end
