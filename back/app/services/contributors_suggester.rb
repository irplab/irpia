class ContributorsSuggester

  def fetch(name:)
    results = Parallel.map([Api::SireneClient.new, Api::IsniClient.new]) do |client|
      client.get_suggestions(query: name)
    end
    results.flatten
  end

end

