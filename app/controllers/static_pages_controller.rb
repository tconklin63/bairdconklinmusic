class StaticPagesController < ApplicationController
  
  def home
  end
  
  def contact_us
  end
  
  def math
    render :layout => 'math_layout'
  end

end