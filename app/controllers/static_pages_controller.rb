class StaticPagesController < ApplicationController
  
  def home
  end
  
  def math
    render :layout => 'math_layout'
  end

end