class FilesController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @files = UploadedFile.all
  end
  
  def upload
    if params[:file]
      UploadedFile.create(filename: params[:file].original_filename, data: params[:file].read)
    else
      flash[:warning] = "No file selected"
    end
    redirect_to :files
  end
  
  def delete
    UploadedFile.where(filename: params[:filename]).first.delete
    redirect_to :files
  end
  
end