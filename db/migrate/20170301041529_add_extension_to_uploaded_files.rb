class AddExtensionToUploadedFiles < ActiveRecord::Migration
  def change
    add_column :uploaded_files, :extension, :string
  end
end
