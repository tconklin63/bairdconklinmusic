class Composition
  include Mongoid::Document
  
  field :description, type: String
  field :name, type: String
  field :recording_url, type: String
  field :sheet_music_url, type: String
  field :voicing, type: String
  field :recording, type: File
  field :sheet_music, type: File
  field :composer, type: String
  field :lyricist, type: String
  field :category, type: String
  
  attr_accessible :description, :name, :recording_url, :sheet_music_url, :voicing, :recording, :sheet_music, :composer, :lyricist, :category
  attr_accessor :recording, :sheet_music
end
