class AddPublishedToComposition < ActiveRecord::Migration
  def change
    add_column :compositions, :published, :boolean
  end
end
