module RenderUserJson
  extend ActiveSupport::Concern

  def render_user_json(user, access_token, status = :ok)
    render json: {
      user: user.as_json(
        except: :refresh_token,
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
      # session_id: session_id,
      access_token: access_token
    }, status: status
  end
end
