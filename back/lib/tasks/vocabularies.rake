def add_to_hierarchy(value, label, parents)
  { value: value, label: label, children: (parents[value] || []).map { |pair| add_to_hierarchy(pair[0], pair[1], parents) } }
end

namespace :vocabularies do
  desc "TODO"

  RDF_VOC_DIRECTORIES = Rails.root.join('etc', 'voc', 'Scolomfr-v7-0', "SKOS-XL", "*.rdf")
  JSON_VOC_DIRECTORIES = Rails.root.join('etc', 'voc', 'json')
  JSON_VOC_HIERARCHY_DIRECTORIES = Rails.root.join('etc', 'voc', 'json_hierarchy')

  task scolomfr_to_json: :environment do
    require 'rdf/rdfxml'
    require 'rdf/vocab'
    Dir.glob(RDF_VOC_DIRECTORIES).reject { |f| File.directory?(f) }.each do |file|
      filename = File.basename(file, '.rdf')
      p filename
      graph = RDF::Graph.load(file)
      query = RDF::Query.new({
                               concept: {
                                 RDF.type => RDF::Vocab::SKOS.Concept,
                                 RDF::Vocab::SKOS.prefLabel => :label,
                                 RDF::Vocab::SKOS.broader => :broader,
                               }
                             }, **{})
      hash = { id: filename.gsub('XL', ''), terms: {} }
      hash_hierarchy = { id: filename.gsub('XL', ''), terms: [] }
      parents = {}
      query.execute(graph) do |concept|
        hash[:terms][concept.concept.to_s.gsub("http://data.education.fr/voc/scolomfr/concept/", "")] = concept.label
        next unless concept.broader
        (parents[concept.broader.to_s] ||= []) << [concept.concept.to_s, concept.label]
      end
      vocab_uri_query = RDF::Query.new({
                                         concept: {
                                           RDF::Vocab::SKOS.hasTopConcept => :top,
                                         }
                                       }, **{})
      vocab_uri = vocab_uri_query.execute(graph).to_a.map(&:concept).uniq.reject { |c| c.to_s == "http://data.education.fr/voc/scolomfr" }.first
      top_concepts_query = RDF::Query.new({
                                            concept: {
                                              RDF::Vocab::SKOS.topConceptOf => vocab_uri,
                                              RDF::Vocab::SKOS.prefLabel => :label
                                            }
                                          }, **{})
      top_concepts = top_concepts_query.execute(graph).to_a.sort do |c1, c2|
        c1.label.to_s <=> c2.label.to_s
      end
      top_concepts.each do |concept|
        hash_hierarchy[:terms] << add_to_hierarchy(concept.concept.to_s, concept.label.to_s, parents)
      end
      File.open("#{JSON_VOC_DIRECTORIES}/#{filename}.json", 'w') { |file| file.write(JSON.dump(hash)) }
      File.open("#{JSON_VOC_HIERARCHY_DIRECTORIES}/#{filename}.json", 'w') { |file| file.write(JSON.dump(hash_hierarchy)) }
    end
  end

end
