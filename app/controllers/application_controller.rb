class ApplicationController < ActionController::Base
  
  before_filter :current_user

  def login_required
    if session[:user]
      return true
    end
    flash[:warning]='Please login to continue'
    session[:return_to]=request.original_url
    redirect_to login_users_path
    return false 
  end

  def current_user
    @current_user = session[:user]
  end

  def redirect_to_stored
    if return_to = session[:return_to]
      session[:return_to]=nil
      redirect_to return_to
    else
      redirect_to root_url
    end
  end
  
  def admin_required
    if !@current_user.admin
      flash[:error] = "Unauthorized!"
      redirect_to root_url
    end
  end

end
