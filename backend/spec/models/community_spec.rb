require 'rails_helper'

RSpec.describe Community, type: :model do
  it 'is valid with name and introduction' do
    community = Community.new(name: 'Community', introduction: 'This is a community.')
    expect(community).to be_valid
  end

  it 'is valid with name, introduction, and avatar' do
    community = Community.new(name: 'Community', introduction: 'This is a community.', avatar: 'avatar.jpg')
    expect(community).to be_valid
  end

  describe 'validations' do
    context "when name is nill" do
      let(:community) { Community.new(name: nil) }

      it 'is not valid without a name' do
        expect(community).not_to be_valid
      end
      
      it 'adds an error message when name is absent' do
        expect(community.errors[:name]).to include("can't be blank")
      end
    end

    it 'validates the length of name' do
      community = Community.new(name: 'a' * 41)
      expect(community).not_to be_valid
      expect(community.errors[:name]).to include('is too long (maximum is 40 characters)')
    end

    it 'validates the length of introduction' do
      community = Community.new(introduction: 'a' * 161)
      expect(community).not_to be_valid
      expect(community.errors[:introduction]).to include('is too long (maximum is 160 characters)')
    end
    # Add more validation tests here
  end

  # describe 'associations' do
  #   # Add association tests here
  # end

  # describe 'methods' do
  #   # Add method tests here
  # end
end
