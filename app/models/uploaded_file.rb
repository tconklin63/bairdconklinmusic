class UploadedFile < ActiveRecord::Base
  attr_accessible :filename, :data, :extension
  validates_presence_of :filename, :data, :extension
  validates_uniqueness_of :filename
end
