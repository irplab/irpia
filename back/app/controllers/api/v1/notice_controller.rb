class Api::V1::NoticeController < ApplicationController

  before_action :convert_to_scolomfr_xml, only: :create

  def create
    render xml: @notice
  end

  private

  def convert_to_scolomfr_xml
    @notice = Serialization::Scolomfr.new.to_xml(permitted_params)
  end

  def permitted_params
    params.require(:notice).permit(:title, :url)
  end

end
