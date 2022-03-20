class Api::V1::VocabulariesController < ApplicationController

  def show
    if params[:hierarchy]
      render json: File.read(Rails.root.join('etc', 'voc', 'json_hierarchy', "#{params[:id]}XL.json"))
    else
      render json: File.read(Rails.root.join('etc', 'voc', 'json', "#{params[:id]}XL.json"))
    end

  end

end
