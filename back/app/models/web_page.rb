require 'ohm'
require 'ohm/timestamps'

class WebPage < Ohm::Model
  include Ohm::Timestamps
  include Ohm::DataTypes

  attribute :url_hash
  index :url_hash

  attribute :url

  attribute :title

  attribute :best_title

  attribute :h1, Type::Array

  attribute :h2, Type::Array

  attribute :description

end
