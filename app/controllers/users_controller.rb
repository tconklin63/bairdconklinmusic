class UsersController < ApplicationController
  
  def new
    @user = User.new
  end
  
  def create
    logger.debug "inside create"
    if User.create(params[:user])
      logger.debug "user saved"
      redirect_to root_url # TODO: creat and login user and redirect to user landing page
    else
      logger.debug "user not saved"
      render new_user_path
    end
  end

end