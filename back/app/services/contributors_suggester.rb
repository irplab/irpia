class ContributorsSuggester

  def fetch(name:)
    Api::SireneClient.new.get_suggestions(name: name)
  end

end

