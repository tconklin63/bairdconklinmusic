class AddArrangerToComposition < ActiveRecord::Migration
  def change
    add_column :compositions, :arranger, :string
  end
end
