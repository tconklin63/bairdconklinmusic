class AddPerformerToCompositions < ActiveRecord::Migration
  def change
    add_column :compositions, :performer, :string
  end
end
