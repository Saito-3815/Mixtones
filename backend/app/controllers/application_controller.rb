class ApplicationController < ActionController::API
  include SessionsHelper
  before_action :set_last_active_at

  private

  # ユーザーがアクションを行うたびにlast_active_atを更新する
  def set_last_active_at
    return unless current_user

    # トランザクションを使用してデータの整合性を保つ
    ActiveRecord::Base.transaction do
      # app/controllers/application_controller.rb
      current_user.update(last_active_at: Time.current)
    end
  rescue StandardError => e
    # エラーログを記録
    Rails.logger.error("Failed to update last_active_at for user #{current_user.id}: #{e.message}")
  end

  protected

  # セッションの有効期限を設定するヘルパーメソッド
  def update_session_expiration(is_persistent_param)
    is_persistent = ActiveModel::Type::Boolean.new.cast(is_persistent_param)
    request.session_options[:expire_after] = is_persistent ? 30.days : 1.hour
  end
end
