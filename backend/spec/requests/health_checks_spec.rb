require 'rails_helper'

RSpec.describe "HealthChecks", type: :request do
  it 'returns 200 status code' do
    get '/health_check'
    expect(response).to have_http_status(:ok)
  end
end
