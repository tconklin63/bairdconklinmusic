class UsersController < ApplicationController
  
  before_filter :login_required, :only=>['welcome', 'change_password', 'hidden']
  before_filter :admin_required, :only=>[:index]

  def index
    @user_list = User.order(:name).all
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if request.post?
      if current_user && current_user.admin
        if @user.save
          flash[:message] = "User creation successful"
          redirect_to :users
        else
          flash[:warning] = "User creation unsuccessful"
          render 'new'
        end
      else
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
  end
  
  def edit
    @user = User.find(params[:id])
  end
  
  def delete
    @user = User.find(params[:id])
    if current_user.admin && current_user != @user
      User.find(params[:id]).destroy
      redirect_to :users
    else
      flash[:error] = "Unauthorized!"
      redirect_to "/"
    end
  end
  
  def update
    @user = User.find(params[:id])
    if current_user.admin && current_user != @user
      @user.update_attribute(:name, params[:user][:name])
      @user.update_attribute(:email, params[:user][:email])
      @user.update_attribute(:admin, params[:user][:admin])
      redirect_to :users
    elsif @user.update_attributes(params[:user])
      if @user == current_user
        session[:user] = @user
        redirect_to '/'
      else
        redirect_to :users
      end
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