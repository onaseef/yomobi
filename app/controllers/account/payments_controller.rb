class Account::PaymentsController < ApplicationController

  layout 'account'

  def index
    @charges = current_user.charge_history
    @page = 'payment-history'
  end

end
