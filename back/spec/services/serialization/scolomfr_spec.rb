require 'rails_helper'

RSpec.describe Serialization::Scolomfr, type: :model do
  describe '#call' do
    let(:notice) { { "title" => "Mathématiques - Terminale Bac Pro Enseignement Agricole (2019) - Manuel élève | Vuibert",
                     "url" => "https://www.vuibert.fr/ouvrage/9782311600643-mathematiques-terminale-bac-pro-enseignement-agricole-2019-manuel-eleve",
                     "description" => "Un manuel pour motiver les élèves et donner du sens à l'apprentissage, reposant sur une démarche progressive et proposant de multiples pistes pour aborder le référentiel et l'épreuve du bac.",
                     "domain" => ["scolomfr-voc-015-num-5005"],
                     "level" => ["scolomfr-voc-022-num-044", "scolomfr-voc-022-num-211", "scolomfr-voc-022-num-129"],
                     "contributors" => { "list" => [
                       { "contributor_name" => "SARL PATRICK DUPONT",
                         "custom_siren" => nil,
                         "custom_isni" => "",
                         "contributor_phone_number" => "+33 7 77 88 99 11",
                         "editorial_brand" => "SARL PATRICK DUPONT",
                         "contributor_role" => "publisher",
                         "contributor_role_label" => "éditeur",
                         "selected_siren_info" => { "identifier" => "123456789", "name" => "SARL PATRICK DUPONT" } },
                       { "contributor_name" => "SODIS",
                         "custom_siren" => nil,
                         "custom_isni" => "0000-0000-0000-0000",
                         "contributor_phone_number" => "+33 2 34 56 78 88",
                         "editorial_brand" => "SODIS",
                         "contributor_role" => "scolomfr-voc-003-num-026",
                         "contributor_role_label" => "distributeur technique",
                         "selected_siren_info" => { "identifier" => "321211161", "name" => "SODIS" } }
                     ] } } }

    it 'receives resource description and copies it to xml notice' do
      service = Serialization::Scolomfr.new(notice)
      service.call
      expect(service.doc.at_xpath('lom:lom/lom:general/lom:title/lom:string/text()').content).to eq("Mathématiques - Terminale Bac Pro Enseignement Agricole (2019) - Manuel élève | Vuibert")
      expect(service.doc.at_xpath('lom:lom/lom:general/lom:title/lom:string')['language']).to eq('fre')
      expect(service.doc.at_xpath('lom:lom/lom:general/lom:description/lom:string/text()').content).to eq("Un manuel pour motiver les élèves et donner du sens à l'apprentissage, reposant sur une démarche progressive et proposant de multiples pistes pour aborder le référentiel et l'épreuve du bac.")
      expect(service.doc.at_xpath('lom:lom/lom:general/lom:description/lom:string')['language']).to eq('fre')
      expect(service.doc.at_xpath('lom:lom/lom:technical/lom:location/text()').content).to eq("https://www.vuibert.fr/ouvrage/9782311600643-mathematiques-terminale-bac-pro-enseignement-agricole-2019-manuel-eleve")
    end
    it 'builds vcards from received contributor data' do
      service = Serialization::Scolomfr.new(notice)
      service.call
      publisher = service.doc.xpath('lom:lom/lom:lifeCycle/lom:contribute').first
      publisher_vcard = VCardigan.parse(publisher.at_xpath('lom:entity').text.strip)
      expect(publisher_vcard.fullname.first.values).to include("SARL PATRICK DUPONT")
      expect(publisher_vcard.tel.first.values).to include("(33) 7-77-88-99-11")
      expect(publisher_vcard.note.map(&:values).flatten).to include("SIREN=123456789")
    end
    it 'doesnt not build educational level taxonPaths from data without level information' do
      service = Serialization::Scolomfr.new(notice.except("level"))
      service.call
      level_classification_node = service.doc.at_xpath "lom:lom/lom:classification[./lom:purpose[.//lom:value[contains(text(),'http://data.education.fr/voc/scolomfr/concept/educational_level')]]]"
      expect(level_classification_node).to be_nil
    end
    it 'builds educational level taxonPaths from received level data' do
      service = Serialization::Scolomfr.new(notice)
      service.call
      level_classification_node = service.doc.at_xpath "lom:lom/lom:classification[./lom:purpose[.//lom:value[contains(text(),'http://data.education.fr/voc/scolomfr/concept/educational_level')]]]"
      expect(level_classification_node.xpath("lom:taxonPath").count).to eq(2)
      terminalePath = level_classification_node.xpath("lom:taxonPath").first
      premierePath = level_classification_node.xpath("lom:taxonPath").last
      expect(terminalePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s).first).to eq("lycée général et technologique")
      expect(terminalePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s)).to include("terminale générale et technologique")
      expect(terminalePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s)).to include("terminale technologique")
      expect(terminalePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s).last).to eq("terminale STD2A")
      expect(premierePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s).first).to eq("lycée général et technologique")
      expect(premierePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s)).to include("1re générale et technologique")
      expect(premierePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s)).to include("1re technologique")
      expect(premierePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s).last).to eq("1re STD2A")
    end
    it 'builds domain taxonPaths from received domain data' do
      service = Serialization::Scolomfr.new(notice)
      service.call
      level_classification_node = service.doc.at_xpath "lom:lom/lom:classification[./lom:purpose[.//lom:value[contains(text(),'http://data.education.fr/voc/scolomfr/concept/scolomfr-voc-028-num-003')]]]"
      expect(level_classification_node.xpath("lom:taxonPath").count).to eq(1)
      etudeArchitecturalePath = level_classification_node.xpath("lom:taxonPath").first
      expect(etudeArchitecturalePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s).first).to eq("systèmes constructifs bois et habitat (BTS)")
      expect(etudeArchitecturalePath.xpath('lom:taxon/lom:entry/lom:string/text()').to_a.map(&:to_s).last).to eq("étude architecturale")
    end
  end

end
