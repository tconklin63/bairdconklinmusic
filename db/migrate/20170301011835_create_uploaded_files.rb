class CreateUploadedFiles < ActiveRecord::Migration
  def change
    create_table :uploaded_files do |t|
      t.string :filename
      t.binary :data

      t.timestamps
    end
  end
end
