class UsersController < ApplicationController
  
  def new
    @user = User.new
  end
  
  def create
    redirect_to root_url # TODO: creat and login user and redirect to user landing page
  end

end