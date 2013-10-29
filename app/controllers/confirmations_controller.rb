class ConfirmationsController < Devise::ConfirmationsController

  layout 'application_loco'

  def show
    user = User.find params[:uid]
    if user.confirmed? && current_user && current_user[:id] == user[:id]
      flash[:notice] = 'You have already confirmed your account.'
      return redirect_to builder_main_path if user.company
      return redirect_to account_setup_path(1)
    elsif user.confirmed?
      sign_out(current_user)
      flash[:alert] = 'You have already confirmed your account. Please sign in to continue.'
      return redirect_to new_session_path(user)
    else
      super
    end
  end
end
