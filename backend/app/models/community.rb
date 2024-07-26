class Community < ApplicationRecord
  include S3Presignable

  has_many :memberships, dependent: :destroy
  has_many :members, through: :memberships, source: :user
  has_many :playlists, dependent: :destroy
  has_many :playlist_tunes, through: :playlists, source: :tune
  has_many :comments, dependent: :destroy

  validates :name,    presence: true, length: { maximum: 40 }
  validates :introduction, length: { maximum: 160 }
  validates :playlist_name, presence: true, length: { maximum: 40 }

  # プレイリストの曲数を返す
  delegate :count, to: :playlist_tunes, prefix: true

  # アバターURLをS3のURLに更新
  def update_avatar_url
    self.avatar = generate_s3_url(avatar) if avatar.present? && avatar.match?(%r{^uploads/[a-f0-9\-]+/[^/]+$})
  end

  # メンバーのアバターURLをS3のURLに更新
  def update_member_avatars
    members.each do |member|
      if member.avatar.present? && member.avatar.match?(%r{^uploads/[a-f0-9\-]+/[^/]+$})
        member.avatar = member.generate_s3_url(member.avatar)
      end
    end
  end
end
