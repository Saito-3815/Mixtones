require 'rails_helper'

RSpec.describe User, type: :model do
  # userオブジェクトがnameとintroductionを持っている場合、有効であること
  it 'is valid with name and introduction' do
    user = User.new(name: 'User', introduction: 'This is a user.')
    expect(user).to be_valid
  end

  # userオブジェクトがname、introduction、avatarを持っている場合、有効であること
  it 'is valid with name, introduction, and avatar' do
    user = User.new(name: 'User', introduction: 'This is a user.', avatar: 'avatar.jpg')
    expect(user).to be_valid
  end

  # validationのテスト
  describe 'validations' do
    # nameがnilの場合、無効であること
    context "when name is nill" do
      let(:user) { User.new(name: nil) }

      it 'is not valid without a name' do
        expect(user).not_to be_valid
      end

      it 'adds an error message when name is absent' do
        user.valid?
        expect(user.errors[:name]).to include("can't be blank")
      end
    end

    # nameが長すぎる場合、無効であること
    context "when name is too long" do
      let(:user) { User.new(name: 'a' * 41) }

      it 'is not valid with too long name' do
        expect(user).not_to be_valid
      end

      it 'adds an error message when name is too long' do
        user.valid?
        expect(user.errors[:name]).to include('is too long (maximum is 40 characters)')
      end
    end

    # introductionが長すぎる場合、無効であること
    context "when introduction is too long" do
      let(:user) { User.new(introduction: 'a' * 161) }

      it 'is not valid with too long introduction' do
        expect(user).not_to be_valid
      end

      it 'adds an error message when introduction is too long' do
        user.valid?
        expect(user.errors[:introduction]).to include('is too long (maximum is 160 characters)')
      end
    end

    # spotify_uri が重複している場合、無効であること
    context "when spotify_uri is duplicated" do
      before do
        User.create(name: 'User', introduction: 'This is a user.', spotify_uri: 'spotify:uri:1')
      end

      let(:user) { User.new(name: 'User', introduction: 'This is a user.', spotify_uri: 'spotify:uri:1') }

      it 'is not valid with duplicated spotify_uri' do
        expect(user).not_to be_valid
      end

      it 'adds an error message when spotify_uri is duplicated' do
        user.valid?
        expect(user.errors[:spotify_uri]).to include('has already been taken')
      end
    end
    # Add more validation tests here
  end

  describe 'associations' do
    # userオブジェクトがlike_tunesを持っている場合、有効であること
    it 'has many like_tunes' do
      user = User.reflect_on_association(:like_tunes)
      expect(user.macro).to eq :has_many
    end

    # userオブジェクトがcheck_tunesを持っている場合、有効であること
    it 'has many check_tunes' do
      user = User.reflect_on_association(:check_tunes)
      expect(user.macro).to eq :has_many
    end
    # Add association tests here
  end

  # describe 'methods' do
  #   # Add method tests here
end
