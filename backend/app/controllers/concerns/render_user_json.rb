module RenderUserJson
  extend ActiveSupport::Concern

  def render_user_json(user, session_id, access_token)
    render json: {
      user: user.as_json(
        except: :refresh_token,
        include: {
          communities: {
            only: [:id]
          },
          like_tunes: {
            only: [:id]
          }
        }
      ),
      session_id: session_id,
      access_token: access_token
    }, status: :created
  end
end
