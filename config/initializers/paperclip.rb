module Paperclip
  module Interpolations
    def company(attachment, style_name)
      attachment.instance.db_name
    end
  end
end
