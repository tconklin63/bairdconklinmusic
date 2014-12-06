class SearchController < ApplicationController
  
  def index
    search = params[:match].downcase
    @compositions = Composition.where("(lower(name) LIKE ? OR lower(composer) LIKE ? OR lower(lyricist) LIKE ? OR lower(arranger) LIKE ? OR lower(category_text) LIKE ? OR lower(voicing_text) LIKE ?) AND published = ?",
                                      "%#{search}%","%#{search}%","%#{search}%","%#{search}%","%#{search}%","%#{search}%",true)
  end
  
  def browse
    @categories = Category.find(:all, :order => :name)
    @voicings = Voicing.find(:all, :order => :name)
  end

  def by_category
    category = params[:category]
    @compositions = Composition.where("category_text = ? AND published = ?","#{category}",true)
    render 'index'
  end
  
  def by_voicing
    voicing = params[:voicing]
    @compositions = Composition.where("voicing_text = ? AND published = ?","#{voicing}",true)
    render 'index'
  end
  
end