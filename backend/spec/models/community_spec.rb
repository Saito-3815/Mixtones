require 'rails_helper'

RSpec.describe Community, type: :model do
  # communityオブジェクトがnameとintroductionを持っている場合、有効であること
  it 'is valid with name and introduction' do
    community = Community.new(name: 'Community', introduction: 'This is a community.', playlist_name: 'Playlist')
    expect(community).to be_valid
  end

  # communityオブジェクトがname、introduction、avatarを持っている場合、有効であること
  it 'is valid with name, introduction, and avatar' do
    community = Community.new(
      name: 'Community',
      introduction: 'This is a community.',
      avatar: 'avatar.jpg',
      playlist_name: 'Playlist'
    )
    expect(community).to be_valid
  end

  # validationのテスト
  describe 'validations' do
    # nameがnilの場合、無効であること
    context "when name is nill" do
      let(:community) { Community.new(name: nil) }

      it 'is not valid without a name' do
        expect(community).not_to be_valid
      end

      it 'adds an error message when name is absent' do
        community.valid?
        expect(community.errors[:name]).to include("can't be blank")
      end
    end

    # nameが長すぎる場合、無効であること
    context "when name is too long" do
      let(:community) { Community.new(name: 'a' * 41) }

      it 'is not valid with too long name' do
        expect(community).not_to be_valid
      end

      it 'adds an error message when name is too long' do
        community.valid?
        expect(community.errors[:name]).to include('is too long (maximum is 40 characters)')
      end
    end

    # introductionが長すぎる場合、無効であること
    context "when introduction is too long" do
      let(:community) { Community.new(introduction: 'a' * 161) }

      it 'is not valid with too long introduction' do
        expect(community).not_to be_valid
      end

      it 'adds an error message when introduction is too long' do
        community.valid?
        expect(community.errors[:introduction]).to include('is too long (maximum is 160 characters)')
      end
      # Add more validation tests here
    end

    describe 'associations' do
      it 'reflects correct association macro for playlist_tunes' do
        expect(Community.reflect_on_association(:playlist_tunes).macro).to eq(:has_many)
      end

      it 'reflects correct association through option for playlist_tunes' do
        expect(Community.reflect_on_association(:playlist_tunes).options[:through]).to eq(:playlists)
      end

      it 'reflects correct association source option for playlist_tunes' do
        expect(Community.reflect_on_association(:playlist_tunes).options[:source]).to eq(:tune)
      end
    end

    describe 'scopes' do
      let!(:community) { create(:community) }
      let(:recommend_playlist) { create(:playlist, community: community, recommend: true) }
      let(:non_recommend_playlist) { create(:playlist, community: community, recommend: false) }
      let!(:recommend_tune) { create(:tune, playlists: [recommend_playlist]) }
      let!(:non_recommend_tune) { create(:tune, playlists: [non_recommend_playlist]) }

      it 'orders playlist_tunes by recommend DESC' do
        recommend_playlist
        non_recommend_playlist
        expect(community.playlist_tunes).to eq([recommend_tune, non_recommend_tune])
      end
    end
  end
end
