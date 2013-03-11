class UsersController < ApplicationController
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to root_url # TODO: create and login user and redirect to user landing page
    else
      render new_user_path
    end
  end

end