class FilesController < ApplicationController
  
  before_filter :login_required, except: :uploads
  before_filter :admin_required, except: :uploads
  
  def index
    @files = UploadedFile.all.sort{|a,b| a.filename.downcase <=> b.filename.downcase}
  end
  
  def upload
    if params[:file]
      UploadedFile.create(filename: params[:file].original_filename,
                          data: params[:file].read,
                          extension: params[:file].original_filename.split('.').last)
    else
      flash[:warning] = "No file selected"
    end
    redirect_to :files
  end

  def uploads
    filename = "#{params[:filename]}.#{params[:format]}"
    file = UploadedFile.where(filename: filename).first
    send_data file.data, filename: file.filename, disposition: 'inline'
  end
  
  def delete
    UploadedFile.where(filename: params[:filename]).first.delete
    redirect_to :files
  end
  
end