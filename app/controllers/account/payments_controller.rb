class Account::PaymentsController < ApplicationController

  layout 'account'

  def index
    @payments = current_user.payments
  end

end
