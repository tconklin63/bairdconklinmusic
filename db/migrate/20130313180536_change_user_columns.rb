class ChangeUserColumns < ActiveRecord::Migration
  def up
    rename_column :users, :password, :encrypted_password
    add_column :users, :salt, :string
  end

  def down
  end
end
