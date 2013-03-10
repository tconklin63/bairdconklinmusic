class UserSessionsController < ApplicationController
  def new
    @user_session = UserSession.new
  end

  def create
    @user_session = UserSession.new(params[:user_session])
    if @user_session.save
      redirect_to :root # change to user landing page
    else
      render :action => :new
    end
  end

  def destroy
    current_user_session.destroy
    redirect_to :root
  end
end