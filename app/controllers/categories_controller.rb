class CategoriesController < ApplicationController
  
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @categories = Category.find(:all, :order => :name)
  end
  
  def new
    @category = Category.new
  end
  
  def create
    @category = Category.new(params[:category])
    if @category.save
      flash[:message] = "Category created"
    else
      flash[:warning] = "Category not created"
    end
    redirect_to :categories
  end

  def delete
    if current_user.admin
      category = Category.find(params[:id])
      category.destroy
      redirect_to :categories
    else
      flash[:error] = "Unauthorized!"
      redirect_to "/"
    end
  end

  
end