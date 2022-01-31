require 'ohm'
require 'ohm/timestamps'

class Suggestion < Ohm::Model
  include Ohm::Timestamps

  attribute :name

  attribute :suggestions

  attribute :status, ->(s) { s || 'running' }

  set :threads, SuggestionsThread

  def save
    unless new?
      update_suggestions!
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
    super.merge(name: name, status: status, total: total_count, terminated: terminated_count, updated_at: updated_at, threads: threads, suggestions: json_suggestions)
  end

  def update_suggestions!
    self.suggestions = MetadataProcessor.new.postprocess(SuggestionsAggregator.new.aggregate(from: self.threads)).to_json
  end

  private

  def json_suggestions
    JSON.parse(self.suggestions)
  rescue StandardError
    []
  end

end
