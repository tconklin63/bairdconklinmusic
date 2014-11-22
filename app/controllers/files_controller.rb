class FilesController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @files = Dir.glob(UPLOAD_DIR+'/*').sort
  end
  
  def upload
    Dir.mkdir(UPLOAD_DIR) unless File.exists?(UPLOAD_DIR)
    if params[:file]
      File.open(File.join(UPLOAD_DIR, params[:file].original_filename), 'wb') do |file|
        file.write(params[:file].read)
      end
    else
      flash[:warning] = "No file selected"
    end
    redirect_to :files
  end
  
  def delete
    File.delete(params[:file])
    redirect_to :files
  end
  
end