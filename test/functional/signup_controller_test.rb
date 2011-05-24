require 'test_helper'

class SignupControllerTest < ActionController::TestCase
  test "should get default" do
    get :default
    assert_response :success
  end

end
