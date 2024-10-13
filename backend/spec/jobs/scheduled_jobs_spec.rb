# spec/jobs/scheduled_jobs_spec.rb
require 'rails_helper'
require 'sidekiq/testing'
require 'sidekiq-cron'

RSpec.describe 'Scheduled Jobs', type: :job do
  before do
    Sidekiq::Testing.fake!
    Sidekiq::Cron::Job.destroy_all!
    Sidekiq::Cron::Job.create(name: 'daily_test_job', cron: '0 0 * * *', class: 'TestJob')
  end

  it 'schedules the daily_test_job' do
    job = Sidekiq::Cron::Job.find('daily_test_job')
    expect(job).not_to be_nil
    expect(job.cron).to eq('0 0 * * *')

    # ジョブをスケジュールに追加
    job.enque!

    # ジョブがキューに追加されていることを確認
    expect do
      TestJob.perform_later("テストパラメータ")
    end.to change { Sidekiq::Queues["default"].size }.by(1)
  end
end
