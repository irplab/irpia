class Api::V1::ContributorsController < ApplicationController

  before_action :fetch_contributors, only: :create

  def create
    render json: @contributors
  end

  private

  def fetch_contributors
    @contributors = ContributorsSuggester.new.fetch(name: permitted_params[:name])
  end

  def permitted_params
    params.require(:contributor).permit(:name)
  end

end
