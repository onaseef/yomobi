class AccountController < ApplicationController

  before_filter :authenticate_user!
  layout 'account'

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    u_params = params[:user]
    old_email = @user.email

    if u_params[:current_password].blank?
      flash[:alert] = t'account.enter_current_password'
    elsif @user.update_with_password(u_params)
      sign_in(@user, :bypass => true)
      flash[:notice] = t'account.updated_success'
      if @user.email != old_email
        UserMailer.email_changed_notice(@user, old_email).deliver
      end
    else
      error = @user.errors.first
      flash[:alert] = "Error: #{error[0].to_s.humanize} #{error[1]}"
    end
    redirect_to account_path
  end

end
