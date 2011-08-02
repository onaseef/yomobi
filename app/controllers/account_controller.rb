class AccountController < ApplicationController
  before_filter :authenticate_user!

  def edit
    @user = current_user
    puts @user.errors
  end

  def update
    @user = current_user
    u_params = params[:user]

    if u_params[:current_password].blank?
      flash[:alert] = "Please enter your current password to update your account."
    elsif @user.update_with_password(u_params)
      sign_in(@user, :bypass => true)
      flash[:notice] = "Account updated successfully."
    else
      error = @user.errors.first
      flash[:alert] = "Error: #{error[0].to_s.humanize} #{error[1]}"
    end
    redirect_to account_path
  end

end
