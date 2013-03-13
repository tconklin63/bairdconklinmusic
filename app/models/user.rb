class User < ActiveRecord::Base
  
  attr_accessible :email, :name, :password, :password_confirmation
  attr_accessor :password_confirmation
  attr_protected :id, :admin, :salt
  
  validates :name, :presence => true
  validates :email, :presence => true, :uniqueness => true
  validates :password, :length => { :in => 6..20 }, :confirmation =>true
  validates :password_confirmation, :presence => true
  validates_confirmation_of :password
  
end
