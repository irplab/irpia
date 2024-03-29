class Api::V1::ImageController < ApplicationController

  before_action :base_64_convert, only: :create

  DEFAULT_BASE_64 = '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'
  DEFAULT_TYPE = 'image/png'

  def create
    render json: { image: @image || DEFAULT_BASE_64, type: @type || DEFAULT_TYPE }
  end

  private

  def base_64_convert
    url = permitted_params['url']
    return unless url
    require 'httparty'
    response = HTTParty.get(url)
    success = response.code == 200 && response.headers['Content-Type'].start_with?('image')
    return unless success
    require 'base64'
    @image = Base64.encode64(response.body)
    @type = response.headers['Content-Type']
  end

  def permitted_params
    params.require(:image).permit(:url)
  end

end
