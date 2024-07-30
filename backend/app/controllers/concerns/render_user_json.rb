module RenderUserJson
  extend ActiveSupport::Concern

  def render_user_json(user, access_token, status = :ok)
    if user.avatar.present? && user.avatar.match?(%r{^uploads/[a-f0-9\-]+/[^/]+$})
      avatar_url = user.generate_s3_url(user.avatar)
      render json: {
        user: user.as_json(
          except: :refresh_token,
          methods: :spotify_id_present,
          include: {
            communities: {
              only: [:id]
            },
            like_tunes: {
              only: [:id]
            },
            check_tunes: {
              only: [:id]
            }
          }
        ).merge(avatar: avatar_url),
        # session_id: session[:session_id],
        access_token: access_token
      }, status: status
      return
    end

    render json: {
      user: user.as_json(
        except: :refresh_token,
        methods: :spotify_id_present,
        include: {
          communities: {
            only: [:id]
          },
          like_tunes: {
            only: [:id]
          },
          check_tunes: {
            only: [:id]
          }
        }
      ),
      # session_id: session[:session_id],
      access_token: access_token
    }, status: status
  end
end
