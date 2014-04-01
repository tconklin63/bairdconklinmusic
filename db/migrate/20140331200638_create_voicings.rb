class CreateVoicings < ActiveRecord::Migration
  def change
    create_table :voicings do |t|
      t.string :name

      t.timestamps
    end
  end
end
