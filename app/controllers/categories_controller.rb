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
  
  def edit
    @category = Category.find(params[:id])
  end
  
  def update
    @category = Category.find(params[:id])
    if @category.update_attributes(params[:category])
      redirect_to :categories
    else
      render 'edit'
    end
  end

end