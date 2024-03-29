class Api::V1::SuggestionsController < ApplicationController

  before_action :fetch_suggestion, only: :show

  before_action :create_suggestion, only: :create

  def create
    render json: @suggestion
  end

  POLL_WAIT_DURATION = 0.1

  def show
    unless @suggestion.status == 'complete'
      while @suggestion.updated_at == params[:timestamp] && @suggestion.status != 'complete'
        sleep(POLL_WAIT_DURATION)
        fetch_suggestion
      end
    end
    render json: @suggestion
  end

  private

  def create_suggestion
    @suggestion = SuggestionsScheduler.new.init(with_params: MetadataProcessor.new(permitted_params).preprocess.metadata, authenticated: current_user.present?)
  end

  def fetch_suggestion
    @suggestion = Suggestion[params[:id]]
  end

  def permitted_params
    params.require(:notice).permit(:title, :url, :description, :document_type_id, :document_type_label, :educational_resource_type_id, :educational_resource_type_label, { domain: [] }, { level: [] })
  end

end
