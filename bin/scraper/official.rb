#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/scraper_data'
require 'open-uri/cached'
require 'pry'

class Legislature
  # details for an individual member
  class Member < Scraped::HTML
    field :uuid do
      noko.css('.uuid').text.tidy
    end

    field :name do
      [firstname, lastname].join(' ')
    end

    field :lastname do
      noko.css('.lastname').text.tidy
    end

    field :firstname do
      noko.css('.firstname').text.tidy
    end

    field :group do
      noko.css('.group').text.tidy
    end

    field :portfolios do
      noko.css('.portfolios').text.tidy
    end

    field :birth_date do
      return unless dob[/(\d\d)\/(\d\d)\/(\d\d\d\d)/]

      Regexp.last_match.captures.reverse.join('-')
    end

    field :birthplace do
      noko.css('.birthPlace').text.tidy.delete_prefix('à ')
    end

    field :seat do
      noko.css('.seat').text.tidy.to_i
    end

    private

    def dob
      noko.css('.birthdate').text.tidy
    end
  end

  # The page listing all the members
  class Members < Scraped::HTML
    field :members do
      member_container.map { |member| fragment(member => Member) }
        .reject { |mem| mem.uuid.empty? }
        .sort_by(&:seat).map(&:to_h).uniq
    end

    private

    def member_container
      noko.css('.member .lastname').map(&:parent)
    end
  end
end

file = Pathname.new 'html/official.html'
puts EveryPoliticianScraper::FileData.new(file, klass: Legislature::Members).csv
