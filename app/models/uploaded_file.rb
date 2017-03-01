class UploadedFile < ActiveRecord::Base
  attr_accessible :filename, :data
  validates_presence_of :filename, :data
  validates_uniqueness_of :filename
end
