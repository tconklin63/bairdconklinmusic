class FilesController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
  end
  
  def upload
  end
  
  def delete
  end
  
end