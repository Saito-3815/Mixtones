# app/mailers/system_health_mailer.rb
class SystemHealthMailer < ApplicationMailer
  default to: ENV['GMAIL_USERNAME']

  def health_check_email
    @memory_usage = params[:memory_usage]
    @redis_response = params[:redis_response]
    @retrieved_value = params[:retrieved_value]

    mail(subject: 'システム健全性チェック結果')
  end
end
