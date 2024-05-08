require 'rails_helper'

RSpec.describe Tune, type: :model do
  # tuneオブジェクトがname、artist、album、added_at、spotify_uriを持っている場合、有効であること
  it 'is valid with name, artist, album, added_at, and spotify_uri' do
    tune = Tune.new(
      name: 'Tune',
      artist: 'Artist',
      album: 'Album',
      added_at: Time.zone.now,
      spotify_uri: 'spotify:track:1234567890'
    )
    expect(tune).to be_valid
  end

  # validationのテスト
  describe 'validations' do
    # nameがnilの場合、無効であること
    context "when name is nill" do
      let(:tune) { Tune.new(name: nil) }

      it 'is not valid without a name' do
        expect(tune).not_to be_valid
      end

      it 'adds an error message when name is absent' do
        tune.valid?
        expect(tune.errors[:name]).to include("can't be blank")
      end
    end

    # artistがnilの場合、無効であること
    context "when artist is nill" do
      let(:tune) { Tune.new(artist: nil) }

      it 'is not valid without a artist' do
        expect(tune).not_to be_valid
      end

      it 'adds an error message when artist is absent' do
        tune.valid?
        expect(tune.errors[:artist]).to include("can't be blank")
      end
    end

    # albumがnilの場合、無効であること
    context "when album is nill" do
      let(:tune) { Tune.new(album: nil) }

      it 'is not valid without a album' do
        expect(tune).not_to be_valid
      end

      it 'adds an error message when album is absent' do
        tune.valid?
        expect(tune.errors[:album]).to include("can't be blank")
      end
    end

    # added_atがnilの場合、無効であること
    context "when added_at is nill" do
      let(:tune) { Tune.new added_at: nil }

      it 'is not valid without a added_at' do
        expect(tune).not_to be_valid
      end

      it 'adds an error message when added_at is absent' do
        tune.valid?
        expect(tune.errors[:added_at]).to include("can't be blank")
      end
    end

    # spotify_uriがnilの場合、無効であること
    context "when spotify_uri is nill" do
      let(:tune) { Tune.new(spotify_uri: nil) }

      it 'is not valid without a spotify_uri' do
        expect(tune).not_to be_valid
      end

      it 'adds an error message when spotify_uri is absent' do
        tune.valid?
        expect(tune.errors[:spotify_uri]).to include("can't be blank")
      end
    end

    # spotify_uri が重複している場合、無効であること
    context "when spotify_uri is duplicated" do
      before do
        Tune.create(
          name: 'Tune',
          artist: 'Artist',
          album: 'Album',
          avatar: 'avatar.jpg',
          added_at: Time.zone.now,
          spotify_uri: 'spotify:track:1234567890'
        )
      end

      let(:tune) do
        Tune.new(
          name: 'Tune',
          artist: 'Artist',
          album: 'Album',
          avatar: 'avatar.jpg',
          added_at: Time.zone.now,
          spotify_uri: 'spotify:track:1234567890'
        )
      end

      it 'is not valid with duplicated spotify_uri' do
        expect(tune).not_to be_valid
      end

      it 'adds an error message when spotify_uri is duplicated' do
        tune.valid?
        expect(tune.errors[:spotify_uri]).to include('has already been taken')
      end
    end
  end
end
