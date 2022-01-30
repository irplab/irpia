class Api::V1::VocabulariesController < ApplicationController


  def show
    render json: File.read(Rails.root.join('etc', 'voc', 'json', "#{params[:id].to_i}XL.json"))
  end



end
