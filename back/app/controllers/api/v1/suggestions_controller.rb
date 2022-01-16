class Api::V1::SuggestionsController < ApplicationController

  def create
    render json: { suggestions: { title: 'toto suggestion' } }
  end

end
