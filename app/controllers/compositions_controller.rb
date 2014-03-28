class CompositionsController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @compositions = Composition.find(:all)
  end
  
  def new
    @composition = Composition.new
  end
  
  def create
    @composition = Composition.new(params[:composition])
    if params[:composition][:sheet_music]
      File.open(File.join(UPLOAD_DIR, params[:composition][:sheet_music].original_filename), 'wb') do |file|
        file.write(params[:composition][:sheet_music].read)
      end
    end
    if params[:composition][:recording]
      File.open(File.join(UPLOAD_DIR, params[:composition][:recording].original_filename), 'wb') do |file|
        file.write(params[:composition][:recording].read)
      end
    end
    @composition.sheet_music_url = params[:composition][:sheet_music].original_filename
    @composition.recording_url = params[:composition][:recording].original_filename
    if @composition.save
      flash[:message] = "Composition created"
    else
      flash[:warning] = "Composition not created"
    end
    redirect_to :compositions
  end
  
  def delete
    if current_user.admin
      composition = Composition.find(params[:id])
      FileUtils.rm_f(File.join(UPLOAD_DIR, composition.sheet_music_url))
      FileUtils.rm_f(File.join(UPLOAD_DIR, composition.recording_url))
      composition.destroy
      redirect_to :compositions
    else
      flash[:error] = "Unauthorized!"
      redirect_to "/"
    end
  end


end