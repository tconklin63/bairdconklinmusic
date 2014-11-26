class Composition < ActiveRecord::Base
  attr_accessible :name, :composer, :arranger, :lyricist, :description, :category, :category_text, :voicing, :voicing_text, :recording_file, :sheet_music_file, :published
end
