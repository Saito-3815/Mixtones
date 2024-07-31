class User < ApplicationRecord
  include S3Presignable

  has_many :memberships, dependent: :destroy
  has_many :communities, through: :memberships
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :like_tunes, through: :likes, source: :tune
  has_many :checks, dependent: :destroy
  has_many :check_tunes, through: :checks, source: :tune

  validates :name,          presence: true, length: { maximum: 40 }
  validates :introduction,  length: { maximum: 160 }
  validates :spotify_id,    uniqueness: true

  encrypts :spotify_id, deterministic: true, downcase: true
  encrypts :refresh_token

  def guest?
    spotify_id == 'guest_user'
  end

  # アバターURLをS3のURLに更新
  def update_avatar_url
    self.avatar = generate_s3_url(avatar) if avatar.present? && avatar.match?(%r{^uploads/[a-f0-9\-]+/[^/]+$})
  end

  # spotify_idが存在するか
  def spotify_id_present
    spotify_id.present? && spotify_id != 'guest_user' && spotify_id != 'original_guest_user'
  end

  # spotify_idをフロントエンドに返却時、真偽値に変換
  def as_json(options = {})
    super(options).merge('spotify_id' => spotify_id_present)
  end
end
