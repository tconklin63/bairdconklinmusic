class CompositionsController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @compositions = Composition.find(:all)
  end
  
  def new
    @composition = Composition.new
  end
  
  def create
    
  end

end