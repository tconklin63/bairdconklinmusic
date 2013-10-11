class UsersController < ApplicationController
  
  before_filter :login_required, :only=>['welcome', 'change_password', 'hidden']

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if request.post?  
      if @user.save
        session[:user] = User.authenticate(@user.email, @user.password)
        flash[:message] = "Signup successful"
        redirect_to '/'        
      else
        flash[:warning] = "Signup unsuccessful"
        render 'new'
      end
    end
  end
  
  def edit
    @user = User.find(params[:id])
  end
  
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      if @user == current_user
        session[:user] = @user        
      end
      redirect_to '/'
    else
      render 'edit'
    end
  end

  def login
    if request.post?
      if session[:user] = User.authenticate(params[:email], params[:password])
        flash[:message]  = "Login successful"
        redirect_to_stored
      else
        flash[:warning] = "Login unsuccessful"
        render 'login'
      end
    end
  end

  def logout
    session[:user] = nil
    flash[:message] = 'Logged out'
    redirect_to '/'
  end

  #need to implement mailer before uncommenting
  #def forgot_password
  #  if request.post?
  #    u= User.find_by_email(params[:user][:email])
  #    if u and u.send_new_password
  #      flash[:message]  = "A new password has been sent by email."
  #      redirect_to :action=>'login'
  #    else
  #      flash[:warning]  = "Couldn't send password"
  #    end
  #  end
  #end

  def change_password
    @user=session[:user]
    if request.post?
      @user.update_attributes(:password=>params[:user][:password], :password_confirmation => params[:user][:password_confirmation])
      if @user.save
        flash[:message]="Password Changed"
      end
    end
  end

  def welcome
  end

  def hidden
  end

end