class CompositionsController < ApplicationController
  
  before_filter :login_required, :except => :show
  before_filter :admin_required, :except => :show
  
  def index
    @compositions = Composition.find(:all)
  end
  
  def show
    @composition = Composition.find(params[:id])
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
    @composition.category_text = Category.find(@composition.category).name
    @composition.voicing_text = Voicing.find(@composition.voicing).name
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
    end
    if params[:commit] == 'Un-Publish'
      composition.published = false
    end
    composition.update_attributes(params[:composition])
    composition.category_text = Category.find(composition.category).name
    composition.voicing_text = Voicing.find(composition.voicing).name
    composition.save
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
    @pdf_files << "Select File"
    uploaded_pdf_files.each do |file|
      @pdf_files << File.basename(file)
    end
    uploaded_audio_files = Dir.glob(UPLOAD_DIR+'/*.mp3').sort
    @audio_files = Array.new
    @audio_files << 'Select File'
    uploaded_audio_files.each do |file|
      @audio_files << File.basename(file)
    end
  end


end