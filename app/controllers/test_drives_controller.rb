class TestDrivesController < ApplicationController
  def new
  end

  def create
    @user = User.new

    unless @user.create_test_drive
      render :new, alert: "Sorry, we can't build your test site now"
    end
  end
end
