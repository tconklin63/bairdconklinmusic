class AddToComposition < ActiveRecord::Migration
  def change
    add_column :compositions, :category_text, :string
    add_column :compositions, :voicing_text, :string
  end
end
