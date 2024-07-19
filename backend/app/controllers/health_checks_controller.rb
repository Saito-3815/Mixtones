# module Api
#   module V1
    class HealthChecksController < ApplicationController
      def index
        head :ok
      end
    end
#   end
# end
