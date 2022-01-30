require 'ohm'
require 'ohm/timestamps'

class Suggestion < Ohm::Model
  include Ohm::Timestamps

  attribute :name

  attribute :status, ->(s) { s || 'running' }

  set :threads, SuggestionsThread

  def save
    unless new?
      self.status = (total_count === terminated_count) ? 'complete' : 'running'
    end
    super
  end

  def total_count
    self.threads.count
  end

  def terminated_count
    self.threads.filter { |thread| %w[complete failed].include?(thread.status) }.count
  end

  def to_hash
    super.merge(name: name, status: status, total: total_count, terminated: terminated_count, updated_at: updated_at, threads: threads)
  end

end
