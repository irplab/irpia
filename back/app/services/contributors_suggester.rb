class ContributorsSuggester

  def fetch(name:)
    results = Parallel.map([Api::BnfClient.new, Api::SireneClient.new]) do |client|
      client.get_suggestions(query: name)
    end
    results.flatten
  end

end

