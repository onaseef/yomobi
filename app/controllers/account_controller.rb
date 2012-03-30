class AccountController < ApplicationController
  include WepayRails::Payments

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
      flash[:alert] = "Please enter your current password to update your account."
    elsif @user.update_with_password(u_params)
      sign_in(@user, :bypass => true)
      flash[:notice] = "Account updated successfully."
      if @user.email != old_email
        UserMailer.email_changed_notice(@user, old_email).deliver
      end
    else
      error = @user.errors.first
      flash[:alert] = "Error: #{error[0].to_s.humanize} #{error[1]}"
    end
    redirect_to account_path
  end

  def upgrade
    if params[:site]
      @site = Company.find_by_db_name params[:site]
      redirect_to upgrade_path if @site.nil?

      checkout_params = {
        :amount => 499,
        :short_description => "YoMobi - [#{@site.db_name}]: Professional Site Payment",
        :long_description => "YoMobi - #{@site.url_and_name}: Professional Site Payment ",
        :mode => 'iframe',
        :reference_id => "#{current_user.id}|#{@site.id}"
      }
      @checkout = init_checkout(checkout_params)
    end
    @sites = current_user.companies
  end

end
