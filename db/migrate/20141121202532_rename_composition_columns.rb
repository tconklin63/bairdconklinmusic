class RenameCompositionColumns < ActiveRecord::Migration
  def change
    rename_column :compositions, :sheet_music_url, :sheet_music_file
    rename_column :compositions, :recording_url, :recording_file
  end
end
