module ViewHelpers
  def page(title, id)

    @module = data.module

    @page_id = id

    @page_title = title;

    @page_prefix = @module[@page_id]

    @page = data["" << @page_prefix << "-" << @page_id]

    @fields = @page.fields

    content_for :title do
      title
    end
  end

  def launcher_active(page)
    @page_id == page ? {class:'active'} : {}
  end
end
