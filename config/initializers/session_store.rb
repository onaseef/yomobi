# Be sure to restart your server when you modify this file.

Yomobi::Application.config.session_store :mongoid_store
module ActionDispatch
  module Session
    class MongoidStore < AbstractStore
      def destroy_session(env, sid, options)
        self.send(:destroy, env)
        generate_sid unless options[:drop]
      end
    end
  end
end

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# Yomobi::Application.config.session_store :active_record_store
