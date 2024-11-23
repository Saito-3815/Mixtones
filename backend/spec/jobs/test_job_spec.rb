require 'rails_helper'
require 'sidekiq/testing'


RSpec.describe TestJob, type: :job do
  let(:redis_instance) { instance_double(Redis) }

  before do
    Sidekiq::Worker.clear_all
    allow(Rails.logger).to receive(:info)
    allow(redis_instance).to receive_messages(
      ping: "PONG",
      set: nil,
      get: "test_value"
    )

    # Redisのインスタンスをモックする
    allow(Redis).to receive(:new).and_return(redis_instance)

    # メール送信をモックする
    allow(SystemHealthMailer).to receive_message_chain(:with, :health_check_email, :deliver_now)

    # ジョブを即座に実行する
    Sidekiq::Testing.inline! do
      TestJob.perform_later("テストパラメータ")
    end
  end

  it 'ジョブがキューに追加され、正しく実行されることを確認する' do
    expect do
      TestJob.perform_later("テストパラメータ")
    end.to change { Sidekiq::Queues["default"].size }.by(1)
  end

  it 'ジョブの実行内容を確認する - システム健全性チェック開始' do
    expect(Rails.logger).to have_received(:info).with("システム健全性チェック開始")
  end

  it 'ジョブの実行内容を確認する - 現在のメモリ使用量' do
    expect(Rails.logger).to have_received(:info).with(/現在のメモリ使用量：\d+\.\d+ MB/)
  end

  it 'ジョブの実行内容を確認する - Redis ping response' do
    expect(Rails.logger).to have_received(:info).with("Redis ping response: PONG")
  end

  it 'ジョブの実行内容を確認する - Redisにセットしたキー' do
    expect(Rails.logger).to have_received(:info).with("Redisにセットしたキー: test_job:test_key, バリュー: test_value")
  end

  it 'ジョブの実行内容を確認する - Redisから取得したバリュー' do
    expect(Rails.logger).to have_received(:info).with("Redisから取得したバリュー: test_value")
  end

  it 'ジョブの実行内容を確認する - システム健全性チェック完了' do
    expect(Rails.logger).to have_received(:info).with("システム健全性チェック完了")
  end

  it 'システム健全性チェック完了後にメールを送信する' do
    expect(SystemHealthMailer).to have_received(:with).with(
      memory_usage: instance_of(Float),
      redis_response: "PONG",
      retrieved_value: "test_value"
    )
    expect(SystemHealthMailer.with(memory_usage: instance_of(Float), redis_response: "PONG", retrieved_value: "test_value").health_check_email).to have_received(:deliver_now)
  end
end
