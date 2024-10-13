# # spec/jobs/scheduled_jobs_spec.rb
# require 'rails_helper'
# require 'sidekiq/testing'
# require 'sidekiq-scheduler/testing'

# RSpec.describe 'Scheduled Jobs', type: :job do
#   before do
#     Sidekiq::Testing.fake!
#     Sidekiq::Scheduler.dynamic = true
#     Sidekiq::Scheduler.enabled = true
#     Sidekiq::Scheduler.clear_schedule!
#     Sidekiq.set_schedule('test_job', { 'cron' => '0 0 * * *', 'class' => 'TestJob' })
#     Sidekiq::Scheduler.reload_schedule!
#   end

#   it 'schedules the test job' do
#     schedule = Sidekiq.get_schedule('test_job')
#     expect(schedule).not_to be_nil
#     expect(schedule['cron']).to eq('0 0 * * *')

#     # ジョブをスケジュールに追加
#     Sidekiq::Scheduler.enqueue_jobs

#     # ジョブがキューに追加されていることを確認
#     expect do
#       TestJob.perform_later("テストパラメータ")
#     end.to change { Sidekiq::Queues["default"].size }.by(1)
#   end
# end
