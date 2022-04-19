require 'ohm'
require 'ohm/timestamps'

class Token < Ohm::Model
  include Ohm::Timestamps

  attribute :name
  index :name

  attribute :value

end
