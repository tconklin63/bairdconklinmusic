class VoicingsController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @voicings = Voicing.find(:all, :order => :name)
  end
  
  def new
    @voicing = Voicing.new
  end
  
  def create
    @voicing = Voicing.new(params[:voicing])
    if @voicing.save
      flash[:message] = "Voicing created"
    else
      flash[:warning] = "Voicing not created"
    end
    redirect_to :voicings
  end

  def delete
    if current_user.admin
      voicing = Voicing.find(params[:id])
      voicing.destroy
      redirect_to :voicings
    else
      flash[:error] = "Unauthorized!"
      redirect_to "/"
    end
  end
  
  def edit
    @voicing = Voicing.find(params[:id])
  end
  
  def update
    @voicing = Voicing.find(params[:id])
    if @voicing.update_attributes(params[:voicing])
      redirect_to :voicings
    else
      render 'edit'
    end
  end
  
end