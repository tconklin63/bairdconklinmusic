class Composition < ActiveRecord::Base
  attr_accessible :description, :name, :recording_url, :sheet_music_url, :voicing, :recording, :sheet_music
  attr_accessor :recording, :sheet_music
end
