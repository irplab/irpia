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
    self.encrypted_password = Password.create(new_password)
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

  def self.with_mail_and_password(email, password = nil)
    raise "Invalid email address" unless EmailAddress.valid?(email)
    u = User.create
    u.update email: email
    password = random_password if password.blank?
    p password
    u.password = password
    u.save
  end

  def renew_password()
    random_password = User.random_password
    p random_password
    self.password = random_password
    print self.encrypted_password
    save
  end

  private

  PASSWORD_LENGTH = 10

  def self.random_password
    ::Password.pronounceable(PASSWORD_LENGTH)
  end

end
