class StaticPagesController < ApplicationController
  
  def home
    @message = 'Booya!'
  end

end