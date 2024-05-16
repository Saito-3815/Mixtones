module Api
  module V1
    class PlaylistsController < ApplicationController
      def index
        @playlists = Community.find_by(id: params[:community_id]).playlist_tunes.order(added_at: :desc)
        render json: @playlists
      end
    end
  end
end
