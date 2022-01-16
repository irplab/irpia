class HomeController < ActionController::Base

  def index
    if Rails.env.development?
      uri = URI.join(root_url(port: 8080, only_path: false), request.path).to_s
      if request.parameters.has_key?(:directValidation)
        uri = "#{uri}?directValidation=#{request.parameters[:directValidation]}"
      end
      redirect_to uri
    else
      render file: Rails.root.join("public", "index.html")
    end
  end

end
