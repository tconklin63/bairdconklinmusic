class CompositionsController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @compositions = Composition.find(:all)
  end
  
  def new
    @composition = Composition.new
    get_files
  end
  
  def create
    @composition = Composition.new(params[:composition])
    if params[:commit] == 'Publish'
      @composition.published = true
    end
    if @composition.save
      flash[:message] = "Composition created"
    else
      flash[:warning] = "Composition not created"
    end
    redirect_to :compositions
  end
  
  def edit
    @composition = Composition.find(params[:id])
    get_files
  end
  
  def update
    composition = Composition.find(params[:id])
    if params[:commit] == 'Publish'
      composition.published = true
      composition.save
    end
    if params[:commit] == 'Un-Publish'
      composition.published = false
      composition.save
    end
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
  
  private
  
  def get_files
    uploaded_pdf_files = Dir.glob(UPLOAD_DIR+'/*.pdf').sort
    @pdf_files = Array.new
    uploaded_pdf_files.each do |file|
      @pdf_files << File.basename(file)
    end
    uploaded_audio_files = Dir.glob(UPLOAD_DIR+'/*.m4a').sort
    @audio_files = Array.new
    uploaded_audio_files.each do |file|
      @audio_files << File.basename(file)
    end
  end


end