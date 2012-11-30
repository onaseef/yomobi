class TestDrivesController < ApplicationController
  layout 'application_loco'

  def new
  end

  def create
    @user = User.new

    if @user.create_test_drive
      sign_in @user
      redirect_to builder_main_path, notice: t('testdrive.success')
    else
      flash.now[:alert] = t('testdrive.cant_build_test_drive')
      render :new
    end
  end

  def destroy
    sign_out @user
    redirect_to new_user_registration_path
  end
end
