class Api::V1::NoticeController < ApplicationController

  before_action :convert_to_scolomfr_xml, only: :create

  def create
    render xml: @notice
  end

  private

  def convert_to_scolomfr_xml
    @notice = Serialization::Scolomfr.new(permitted_params).call.doc
  end

  def permitted_params
    params.require(:notice).permit(:title, :url, :description, :thumbnail_url, :thumbnail_source, { document_type_id: [] }, { document_type_label: [] }, { educational_resource_type_id: [] }, { educational_resource_type_label: [] }, { domain: [] }, { level: [] }, { contributors: { list: [[:contributor_name, :custom_siren, :custom_isni, :contributor_phone_number, :editorial_brand, :contributor_role, :contributor_role_label, { selected_siren_info: [:identifier, :name] }, { selected_isni_info: [:identifier, :name] }]] } })
  end

end
