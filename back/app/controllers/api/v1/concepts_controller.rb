class Api::V1::ConceptsController < ApplicationController

  before_action :expand_concepts, only: :create

  def create
    render json: @concepts
  end

  private

  def expand_concepts
    @concepts = Serialization::Scolomfr.new().expand_values(permitted_params)
  end

  def permitted_params
    params.require(:values).permit({ domain: [] }, { level: [] })
  end

end
