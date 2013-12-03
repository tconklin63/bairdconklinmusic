class AddLyricistToComposition < ActiveRecord::Migration
  def change
    add_column :compositions, :lyricist, :string
  end
end
