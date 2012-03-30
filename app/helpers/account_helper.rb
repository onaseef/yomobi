module AccountHelper

  def active(switch, trigger)
    (trigger == switch) ? switch : ''
  end
end
