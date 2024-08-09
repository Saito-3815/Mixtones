module RenderUserJson
  extend ActiveSupport::Concern

  def render_user_json(user, access_token, status = :ok, message = nil)
    if user.avatar.present? && user.avatar.match?(%r{^uploads/[a-f0-9\-]+/[^/]+$})
      avatar_url = user.generate_s3_url(user.avatar)
      render json: {
        user: user.as_json(
          except: [:refresh_token, :email, :password_digest],
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
        access_token: access_token,
        message: message
      }, status: status
      return
    end

    render json: {
      user: user.as_json(
        except: [:refresh_token, :email, :password_digest],
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
      access_token: access_token,
      message: message
    }, status: status
  end
end
