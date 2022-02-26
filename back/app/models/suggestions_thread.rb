require 'ohm'
require 'ohm/timestamps'

class SuggestionsThread < Ohm::Model
  include Ohm::Timestamps

  attribute :key

  index :key

  attribute :job_id

  index :job_id

  reference :suggestion, Suggestion

  attribute :status

  attribute :result

  def to_hash
    super.merge(job_id: job_id, status: status)
  end

end
