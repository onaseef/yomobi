class TestDrivesController < ApplicationController
  def new
  end

  def create
    @password = Devise.friendly_token[0,10]
    @user = User.new(password: @password)

    if @user.create_test_drive
      flash.now[:notice] = "Success!"
      sign_in @user
    else
      flash.now[:alert] = "Sorry, we can't build your test site now"
      render :new
    end
  end

  def destroy
    sign_out @user
    redirect_to new_user_registration_path
  end
end
