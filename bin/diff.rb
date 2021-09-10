#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/comparison'

# Remove government members and standardise parties
class Comparison < EveryPoliticianScraper::Comparison
  REMAP = {
    'Déi Lénk' => 'DÉI LÉNK'
  }

  def wikidata_csv_options
    { converters: [->(val, field) { REMAP.fetch(val, val) }] }
  end

  def external
    super.delete_if { |row| (row[:seat] >= 100) || (row[:seat] == 0) }
  end

end

diff = Comparison.new('wikidata/results/current-members.csv', 'data/official.csv').diff
puts diff.sort_by { |r| [r.first, r[1].to_s] }.reverse.map(&:to_csv)
