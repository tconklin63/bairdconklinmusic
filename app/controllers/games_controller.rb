class GamesController < ApplicationController
  
  def reversi
    render :layout => 'math_layout'
  end
  
  def test_reversi
    render :layout => 'math_layout'
  end
  
end
