class CreateCompositions < ActiveRecord::Migration
  def change
    create_table :compositions do |t|
      t.string :name
      t.text :description
      t.string :voicing
      t.string :sheet_music_url
      t.string :recording_url

      t.timestamps
    end
  end
end
