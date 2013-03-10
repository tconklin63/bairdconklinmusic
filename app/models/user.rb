class User < ActiveRecord::Base
  attr_accessible :email, :name, :password, :admin
end
