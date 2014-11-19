class CompositionsController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @compositions = Composition.find(:all)
  end
  
  def new
    @composition = Composition.new
    @pdf_files = Dir.glob(UPLOAD_DIR+'/*.pdf').sort
    @audio_files = Dir.glob(UPLOAD_DIR+'/*.m4a').sort
  end
  
  def create
    @composition = Composition.new(params[:composition])
    if @composition.save
      flash[:message] = "Composition created"
    else
      flash[:warning] = "Composition not created"
    end
    redirect_to :compositions
  end
  
  def edit
    @composition = Composition.find(params[:id])
    @pdf_files = Dir.glob(UPLOAD_DIR+'/*.pdf').sort
    @audio_files = Dir.glob(UPLOAD_DIR+'/*.m4a').sort
  end
  
  def update
    composition = Composition.find(params[:id])
    composition.update_attributes(params[:composition])
    redirect_to :compositions
  end
  
  def delete
    if current_user.admin
      composition = Composition.find(params[:id])
      composition.destroy
      redirect_to :compositions
    else
      flash[:error] = "Unauthorized!"
      redirect_to "/"
    end
  end


end