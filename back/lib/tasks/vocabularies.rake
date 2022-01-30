namespace :vocabularies do
  desc "TODO"

  RDF_VOC_DIRECTORIES = Rails.root.join('etc', 'voc', 'Scolomfr-v7-0', "SKOS-XL", "*.rdf")
  JSON_VOC_DIRECTORIES = Rails.root.join('etc', 'voc', 'json')

  task scolomfr_to_json: :environment do
    require 'rdf/rdfxml'
    require 'rdf/vocab'
    Dir.glob(RDF_VOC_DIRECTORIES).reject{|f| File.directory?(f)}.each do |file|
      filename = File.basename(file, '.rdf')
      graph = RDF::Graph.load(file)
      query = RDF::Query.new({
                               concept: {
                                 RDF.type => RDF::Vocab::SKOS.Concept,
                                 RDF::Vocab::SKOS.prefLabel => :label
                               }
                             }, **{})
      hash = {id: filename.gsub('XL', ''), terms: {}}
      query.execute(graph) do |solution|
        hash[:terms][solution.concept.to_s.gsub("http://data.education.fr/voc/scolomfr/concept/","")] = solution.label
      end
      File.open("#{JSON_VOC_DIRECTORIES}/#{filename}.json", 'w') { |file| file.write(JSON.dump(hash)) }
    end
  end

end
