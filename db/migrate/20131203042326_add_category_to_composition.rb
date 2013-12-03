class AddCategoryToComposition < ActiveRecord::Migration
  def change
    add_column :compositions, :category, :string
  end
end
