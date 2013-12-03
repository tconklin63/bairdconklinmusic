class AddComposerToComposition < ActiveRecord::Migration
  def change
    add_column :compositions, :composer, :string
  end
end
