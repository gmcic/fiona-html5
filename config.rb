###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

page "/*filter.html", layout: false

page "/*pagination.html", layout: false

page "/login.html", :layout => "login"

page "/index.html", :layout => "application"

# 一列布局
page "/views/*list.html", :layout => "list"

# 默认布局
page "/views/*.html", :layout => "page"

page "/test*.html", :layout => "test"

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

# General configuration

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

# i18n
#activate :i18n, :mount_at_root => :en
activate :i18n, :mount_at_root => :zh

set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'
set :fonts_dir, 'assets/fonts'

set :haml, format: :html5

###
# Helpers
###

helpers do
    def bind(key, fieldName)
        if fieldName == 'error'
            return "<span class='label label-danger'>Danger</span>"
        else
            return "{{" << key << "." << fieldName << "}}"
        end
    end

    def bindFilter(key, fieldName, filter)
        if fieldName == 'error'

            return "<span class='label label-danger'>Danger</span>"

        elsif filter == 'dropdown'

            return "{{" << key << "." << fieldName << " | " << filter << ":dropdowns." << fieldName << "Set  }}"

        else
            puts "{{" << key << "." << fieldName << " | " << filter << "}}"

            return "{{" << key << "." << fieldName << " | " << filter << "}}"
        end
    end

    def bindText(inputType, key, fieldName)
        if fieldName == 'error'
            return "<span class='label label-danger'>Danger</span>"
        else
            return "<input type='" << inputType << "' class='form-control form-filter input-sm' ng-model='" << key << "." << fieldName << "'>";
        end
    end

    def bindTextEvent(inputType, key, fieldName, event)
        if fieldName == 'error'
            return "<span class='label label-danger'>Danger</span>"
        else
            return "<input type='" << inputType << "' class='form-control form-filter input-sm' ng-model='" << key << "." << fieldName << "' " << event << " >";
        end
    end

    def bindSelect(inputType, key, fieldName, options)
        if fieldName == 'error'
            return "<span class='label label-danger'>Danger</span>"
        else
            return "<select class='form-control ng-pristine ng-valid ng-touched' id='warehouseId' name='warehouseId' ng-model='" << key << "." << fieldName << "' ng-options='" << options << "' ></select>";
        end
    end

    def inputName(key, fieldName)
        if (fieldName.index("$") == 0)
            return fieldName.delete "$"
        else
            return fieldName
        end
    end

    def inputModel(key, fieldName)
        if fieldName == 'error'
            return fieldName
        elsif (fieldName.index("$") == 0)
            puts "#base: " << fieldName
            return fieldName.delete "$"
        else
            return "" << key << "." << fieldName
        end
    end

    def modal(name, id)
        @modal_id = id
        @modal_name = name
    end

    def portal(name, id)
        @portal_id = id
        @portal_name = name
    end

    # 必填验证
    def validrequired(key, fieldName)
        if fieldName == 'error'
            return 'true'
        else
            return "" << @modal_id << "form." << fieldName << ".$error.required && " << @modal_id << "form.submitted"
        end
    end

    # 电子信箱验证
    def validemail(key, fieldName)
        if fieldName == 'error'
            return 'true'
        else
            return "" << @modal_id << "form." << fieldName << ".$error.email && " << @modal_id << "form.submitted"
        end
    end

    # 输入框长度
    def validmaxlength(key, fieldName)
        if fieldName == 'error'
            return 'true'
        else
            return "" << @modal_id << "form." << fieldName << ".$error.maxlength && " << @modal_id << "form.submitted"
        end
    end

    # URL验证
    def validurl(key, fieldName)
        if fieldName == 'error'
            return 'true'
        else
            return "" << @modal_id << "form." << fieldName << ".$error.url && " << @modal_id << "form.submitted"
        end
    end

    # 数字验证
    def validnumber(key, fieldName)
        if fieldName == 'error'
            return 'true'
        else
            return "" << @modal_id << "form." << fieldName << ".$error.number && " << @modal_id << "form.submitted"
        end
    end

end

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end
