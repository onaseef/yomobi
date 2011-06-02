module SignupHelper

  def active_arrow?(current_step,target_step)
    case current_step - target_step
    when 0
      'active'
    when 1
      'just-active'
    else
      'inactive'
    end
  end
end
