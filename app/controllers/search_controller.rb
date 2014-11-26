class SearchController < ApplicationController
  
  def index
    search = params[:search].downcase
    @compositions = Composition.where("(lower(name) LIKE ? OR lower(composer) LIKE ? OR lower(lyricist) LIKE ? OR lower(arranger) LIKE ? OR lower(category_text) LIKE ? OR lower(voicing_text) LIKE ?) AND published = ?",
                                      "%#{search}%","%#{search}%","%#{search}%","%#{search}%","%#{search}%","%#{search}%",true)
  end
  
end