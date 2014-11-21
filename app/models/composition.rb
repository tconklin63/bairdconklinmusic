class Composition < ActiveRecord::Base
  attr_accessible :name, :composer, :lyricist, :description, :category, :voicing, :recording_file, :sheet_music_file
end
