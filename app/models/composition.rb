class Composition < ActiveRecord::Base
  attr_accessible :name, :composer, :lyricist, :description, :category, :voicing, :recording_url, :sheet_music_url
end
