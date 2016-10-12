angular.module('fiona').controller('BaseController', function ($scope, $http, commons) {

    $scope.error = "未找到定义";

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    // 使用日期控件
    jQuery().datepicker && $(".date-picker-btn").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    }).on("changeDate", function () {
        $(this).parent().prev().val($(this).datepicker('getFormattedDate'));
    });

    jQuery().datepicker && $(".date-picker").datepicker({
        format: 'yyyy-mm-dd',
        orientation: "left",
        autoclose: !0
    });

    $scope.dropboxinit = function (args) {

        var invoke =  args.callback;

        if(!invoke)
        {
            invoke = {};
        }

        if(!!args.dicts)
        {
            // 字典
            $scope.selectDicts('dicttypes', invoke.dicts, args.dicts);
        }

        if(!!args.userdicts)
        {
            // 用户字典
            $scope.selectDicts('userdicts', invoke.userdicts, args.userdicts);
        }

        if(!!args.products)
        {
            // 商品与服务
            $scope.selectDicts('itemcates', invoke.products, args.products);
        }
    };

    $scope.selectDicts = function (uri, invoke, data) {
        $http.post(commons.getBusinessHostname() + "/api/v2/" + uri + "/selects", data).success(function (data, status, headers, config) {
            $.extend($scope.dropdowns, data.data);

            if(invoke)
            {
                invoke.call();
            }
        });
    };

    $scope.setSelectDefault = function (name, fieldNames) {
        angular.forEach(fieldNames, function (fieldName) {
            if (!!$scope.dropdowns[fieldName + "Set"]) {

                var type = $scope.dropdowns[fieldName + "Set"][0];

                if (!!type.itemCode) {
                    // product
                    $scope[name][fieldName] = type.itemCode;
                }
                else if (!!type.valueNameCn) {
                    // dicttypes | dicts | custom
                    $scope[name][fieldName] = type.id;
                }
            }
        });
    };

    $scope.dropdownWithTable = function (component) {

        $http.get(commons.getBusinessHostname() + component.server).success(function (data, status, headers, config) {

            var dropdown = [];

            angular.forEach(data.data, function (record) {
                dropdown.push({id: record[component.value], valueNameCn: record[component.text]});
            });
            
            $scope.dropdowns[component.id + "Set"] = dropdown;
        });
    };
}).controller('FilterController', function ($scope, component, $http, commons) {

    if(!component.filters)
    {
        component.filters = [];
    }

    // component.placeholder

    var _placeholder = "";

    if(!!component.defilters)
    {
        angular.forEach(component.defilters, function (value, key) {
            component.filters.push({"fieldName": key, "operator": "EQ", "value":""});
            _placeholder += "/" + value;
        });
    }

    if(!component.placeholder)
    {
        component.placeholder = "请输入" + _placeholder.substr(1);
    }


    // 默认过滤条件
    component.filtersCopy = component.filters;

    // 搜索条
    component.searchbar = {
        "field": "",
        "fieldName": "综合搜索",
        "dataType": "",
        "type": "",

        "firstValue": "",
        "lastValue": "",

        "firstTextPlaceholder": component.placeholder,
        "lastTextPlaceholder": ""
    };

    /**
     * 搜索条支持
     * ---------------------------
     * */
    component.filter = function () {

        if ((!component.searchbar.type && !!component.searchbar.firstValue)) {

            if (!component.searchbar.field) {
                // 综合搜索
                $.each(component.filtersCopy, function (i, filter) {
                    filter.value = component.searchbar.firstValue;
                });

                component.filters = component.filtersCopy;
            }
            else {
                component.filters = [{
                    "fieldName": component.searchbar.field,
                    "operator": "EQ",
                    "value": component.searchbar.firstValue
                }];
            }

            // console.log(component.filters);
        }
        else if (component.searchbar.type == 'between' && (!!component.searchbar.firstValue || !!component.searchbar.lastValue)) {
            if (!component.searchbar.firstValue || !component.searchbar.lastValue) {
                if (!!component.searchbar.firstValue) {
                    component.filters = [{
                        "fieldName": component.searchbar.field,
                        "operator": "GTE",
                        "value": component.searchbar.firstValue
                    }];
                }

                if (!!component.searchbar.lastValue) {
                    component.filters = [{
                        "fieldName": component.searchbar.field,
                        "operator": "LTE",
                        "value": component.searchbar.lastValue
                    }];
                }
            }
            else {
                component.filters = component.searchbar;
            }
        }
        else {
            component.filters = [];
        }

        if (!!component.callback && !!component.callback.filter) {
            component.callback.filter();
        }

        // // 手动触发
        // $timeout(function () {
        //     component.$apply();
        //     component.search();
        // });
    };

    /**
     * 搜索条支持
     * ---------------------------
     * */
    component.setField = function (field, fieldName, dataType, type) {

        component.searchbar.field = (!field ? '' : field);
        component.searchbar.fieldName = (!fieldName ? '' : fieldName);
        component.searchbar.dataType = (!dataType ? '' : dataType );
        component.searchbar.type = (!type ? '' : type );

        component.searchbar.firstValue = component.searchbar.lastValue = '';

        if (!component.searchbar.field) {
            // 综合搜索
            component.searchbar.firstTextPlaceholder = component.placeholder;
        }
        else if (!!component.searchbar.field && component.searchbar.type == 'between') {
            // 区间搜索
            if (component.searchbar.dataType == 'date') {
                component.searchbar.firstTextPlaceholder = "请选择最小日期";

                component.searchbar.lastTextPlaceholder = "请选择最大日期";
            }
            else {
                component.searchbar.firstTextPlaceholder = "请输入最小值";

                component.searchbar.lastTextPlaceholder = "请输入最大值";
            }
        }
        else {
            component.searchbar.firstTextPlaceholder = "请输入" + component.searchbar.fieldName;
        }
    };


}).controller('PaginationController', function ($scope, component, $http, commons) {

    /**
     * 分页对象
     * ---------------------------
     * */
    component.pagination = {
        'pageSize': 20,
        'pageNumber': 1,
        "first": true,
        "last": false,
        "totalElements": 1,
        "totalPages": 1
    };

    /**
     * 跳转码
     * ---------------------------
     * */
    component.jump = function (_pagenumber) {

        if (!!_pagenumber) {
            component.pagination.pageNumber = _pagenumber;
        }

        if (!!component.callback && !!component.callback.jump) {
            component.callback.jump();
        }
        // $timeout(function () {
        //     component.$apply();
        //     component.search();
        // });
    };

    /**
     * 前一页
     * ---------------------------
     * */
    component.prevpage = function () {

        if (component.pagination.pageNumber > 0) {
            component.pagination.pageNumber -= 1;
        }

        if (!!component.callback && !!component.callback.jump) {
            component.callback.jump();
        }
        // $timeout(function () {
        //     component.$apply();
        //     component.search();
        // });
    };

    /**
     * 后一页
     * ---------------------------
     * */
    component.nextpage = function () {

        component.pagination.pageNumber += 1;

        if (!!component.callback && !!component.callback.jump) {
            component.callback.jump();
        }
        // $timeout(function () {
        //     component.$apply();
        //     component.search();
        // });
    };

}).controller('BaseCUDController', function ($scope, component, $http, commons) {

    // console.log("Foreign | " + component.foreign + ": ");

    /**
     * 添加
     * ---------------------------
     * */
    component.insert = function () {

        $scope[component.id + 'form'].submitted = false;

        // 添加
        $scope[component.id] = {
            // "itemStyle": component.selected.text,
            "createUserId": "1",
            "updateUserId": "1"
        };

        // 若有外键
        // console.log("Foreign | " + component.foreign + ": ");
        // console.log("foreignKey | " + component.foreignkey + ": ");

        if(!!component.foreignkey && !!$scope[component.foreign])
        {

            // console.log(component.foreign+ ": ");
            // console.log($scope[component.foreign]);

            $scope[component.id][component.foreignkey] = $scope[component.foreign].id;
        }

        if (!!component.callback && !!component.callback.insert) {
            component.callback.insert();
        }

        $('#' + component.id).modal('toggle');
    };

    /**
     * 变更
     * ---------------------------
     * */
    component.update = function (id) {

        $scope[component.id + 'form'].submitted = false;

        angular.forEach($scope[component.id + 's'], function (data, index, array) {
            if (data.id == id) {
                $scope[component.id] = data;
            }
        });

        if (!!component.callback && !!component.callback.update) {
            component.callback.update();
        }

        $('#' + component.id).modal('toggle');
    };

    /**
     * 保存
     * ---------------------------
     * */
    component.submit = function () {
        $scope[component.id + "form"].submitted = true;

        if ($scope[component.id + "form"].$valid) {

            var isappend = !$scope[component.id].id;

            $http.post(commons.getBusinessHostname() + component.server, $scope[component.id]).success(function (data, status, headers, config) {

                $('#' + component.id).modal('toggle');

                if (!!component.callback && !!component.callback.submit) {
                    component.callback.submit();
                }

                console.log("is append: " + isappend);

                if(isappend)
                {
                    console.log(data.data);

                    $scope[component.id + "s"].unshift(data.data);
                }

                commons.success("保存成功")
            }).error(function (data, status, headers, config) { //     错误

                commons.modaldanger(component.id, "保存失败")
            });
        }
    };

    /**
     * 批量删除数据
     */
    component.removes = function () {
        var size = 0;

        angular.forEach(component.selection, function (value, key) {
            if (value == true) {
                size++;
            }
        });

        if (confirm("您确定要删除选中[" + size + "]条记录吗?")) {
            angular.forEach(component.selection, function (value, key) {
                if (value == true) {
                    component.delete(key);
                }
            });
        }

    };

    /**
     * 删除单条数据
     */
    component.remove = function (id) {
        if (confirm("您确定要删除该记录吗?")) {
            if (!id) {
                component.delete(component.selectedId);
            }
            else {
                component.delete(id);
            }
        }
    };

    /**
     * 具体的删除逻辑
     */
    component.delete = function (id) {
        $http.delete(commons.getBusinessHostname() + component.server + "/" + id).success(function (data, index, array) {

            var i = 0;
            
            angular.forEach($scope[component.id + "s"], function (elem) {
                if(elem.id == id)
                {
                    $scope[component.id + "s"].splice(i, 1);
                }
                i++;
            });

            if (!!component.callback && !!component.callback.delete) {
                component.callback.delete();
            }
            commons.success("删除成功")

        }).error(function (data) {
            commons.danger("删除失败");
        });
    };

    /**
     * 初始化
     * ---------------------------
     * */
    component.init= function () {
        // component.search();
    };

}).controller('BaseCRUDController', function ($scope, component, $controller, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';


    // 若有外键
    // console.log("Foreign | " + component.foreign + ": ");

    $controller('BaseCUDController', {$scope: $scope, component: component}); //继承

    if(!component.callback)
    {
        component.callback = {};
    }

    if(!component.callback.jump)
    {
        component.callback.jump = function () {
            component.search();
        };
    }

    if(!component.callback.filter)
    {
        component.callback.filter= function () {
            component.search();
        };
    }

    /**
     * 继承过滤&分页
     * ---------------------------
     * */
    $controller('FilterController', {$scope: $scope, component: component}); //继承

    $controller('PaginationController', {$scope: $scope, component: component}); //继承

    /**
     * 选择
     * ---------------------------
     * */
    component.selectedall = false;

    component.isRemoves = true;

    component.selection = {};

    component.selectChange = function () {
        component.isRemoves = true;
        angular.forEach(component.selection, function (value, key) {
            if (value == true) {
                component.isRemoves = false;
            }
        });
    };

    component.selectAll = function () {

        angular.forEach($scope[component.id + 's'], function (data) {
            component.selection[data.id] = component.selectedall;
        });

        component.isRemoves = !component.selectedall
    };

    /**
     * 搜索
     * ---------------------------
     * */
    component.list = function () {
        $http.get(commons.getBusinessHostname() + component.server).success(function (data, status, headers, config) {
            $scope[component.id + 's'] = data.data;
        });
    };

    /**
     * 添加外键过滤条件
     * ---------------------------
     * */
    component.doForeignFilter = function () {
        var _filter;

        angular.forEach(component.filters, function (filter) {
                    if (filter.fieldName == component.foreignkey) {
                _filter = filter;
            }
        });

        if (!_filter) {
            _filter = {"fieldName": component.foreignkey, "operator": "EQ", "value": $scope[component.foreign].id};

            component.filters.push(_filter);
        }
        else {
            _filter.value = $scope[component.foreign].id;
        }

        return _filter;
    };

    /**
     * 搜索
     * ---------------------------
     * */
    component.search = function () {

        if (!!component.foreign && !!$scope[component.foreign] && !!$scope[component.foreign].id) {
            component.doForeignFilter();
        }

        $http.post(commons.getBusinessHostname() + component.server + "/page", {
            'pageSize': component.pagination.pageSize,
            'pageNumber': component.pagination.pageNumber,
            'filters': component.filters
        }).success(function (data, status, headers, config) {

            $scope[component.id + 's'] = data.data.content;

            // // console.log($scope[component.id + 's']);

            // 搜索+分页
            component.pagination.pageNumber = data.data.number + 1;

            component.pagination.last = data.data.last;
            component.pagination.first = data.data.first;
            component.pagination.totalPages = data.data.totalPages;
            component.pagination.totalElements = data.data.totalElements;
        });
    };

}).controller('SidePanelController', function ($scope, component, $controller, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    $controller('BaseCUDController', {$scope: $scope, component: component}); //继承

    // Component 组件必填属性声明
    component.vars = {
        id: true,
        name: true,
        server: true,
        callback: {search: false, insert: false, update: false, switched: false}
    };

    /**
     * 查询
     * ---------------------------
     * */
    component.switched = function (id) {
        component.selectedId = id;

        angular.forEach($scope[component.id + "s"], function (data) {
            if (data.id == component.selectedId) {
                component.selected = data;
                $scope[component.id] = data;
            }
        });

        if(!!component.callback && !!component.callback.switched)
        {
            component.callback.switched();
        }
    };


    /**
     * 查询
     * ---------------------------
     * */
    component.search = function () {
        // 分类
        $http.get(commons.getBusinessHostname() + component.server).success(function (data, status, headers, config) {
            $scope[component.id + "s"]= data.data;

            component.switched($scope[component.id + "s"][0].id);

            if(!!component.callback && !!component.callback.search)
            {
                component.callback.search();
            }
        });
    };

    /**
     * 初始化
     * ---------------------------
     * */
    component.init = function () {
        component.search();
    };
}).controller('TreeSidePanelController', function ($scope, component, $controller, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    // $controller('BaseCUDController', {$scope: $scope, component: component}); //继承

    // Component 组件必填属性声明
    component.vars = {
        id: true,
        name: true,
        server: true,
        callback: {search: false, insert: false, update: false, switched: false}
    };

    /**
     * 目录树配置
     * ---------------------------
     * */
    component.treeConfig = {
        core: {
            themes: {responsive: !1},
            multiple: false,
            animation: false,
            error: function (error) {
                alert("error from js tree - " + angular.toJson(error));
            },
            check_callback: true,
            worker: true
        },
        types: {
            default: {
                icon: 'fa fa-folder icon-state-warning icon-lg'
            },
            file: {icon: "fa fa-file icon-state-warning icon-lg"}
        },
        version: 1,
        plugins: ['types', 'radio']
    };


    /**
     * 树事件触发
     * ---------------------------
     * */
    component.treeEventsObj = {
        'select_node': function (e, item) {

            // // // console.log(item.selected[0]);

            component.selectedId = item.selected[0];

            angular.forEach($scope[component.id + "s"], function (data) {
                if (data.id == component.selectedId) {
                    component.selected = data;
                    $scope[component.id] = data;
                }
            });

            // console.log(component.id + ": ");
            // console.log($scope[component.id]);

            if(!!component.callback && !!component.callback.switched)
            {
                component.callback.switched();
            }

            // component.search();
            // alert('select_node called: ' + item.selected);
        }
    };

    /**
     * 查询
     * ---------------------------
     * */
    component.search = function () {

        $http.get(commons.getBusinessHostname() + component.server).success(function (data, status, headers, config) {

            angular.forEach(data.data, function (item) {
                item.text = item[component.text];
                item.parent = item[component.parent] || "#";
                // item.parent = "#";
                // // console.log("Text: " + item.text)
                // // console.log("Parent: " + item.parent)
            });

            $scope[component.id + 's'] = data.data;

            // // console.log($scope[component.id + 's']);

            // component.treeData = data.data;

            component.treeConfig.version++;
        });
    };

    /**
     * 添加
     * ---------------------------
     * */
    component.insert = function () {

        $scope[component.id + 'form'].submitted = false;

        // 添加
        $scope[component.id] = {
            // "itemStyle": component.selected.text,
            "createUserId": "1",
            "updateUserId": "1"
        };

        // 若有外键
        // console.log("Foreign | " + component.foreign + ": ");
        // console.log("foreignKey | " + component.foreignkey + ": ");

        if(!!component.foreignkey && !!$scope[component.foreign])
        {

            // console.log(component.foreign+ ": ");
            // console.log($scope[component.foreign]);

            $scope[component.id][component.foreignkey] = $scope[component.foreign].id;
        }

        if (!!component.callback && !!component.callback.insert) {
            component.callback.insert();
        }

        $('#' + component.id).modal('toggle');
    };

    /**
     * 变更
     * ---------------------------
     * */
    component.update = function (id) {

        $scope[component.id + 'form'].submitted = false;

        angular.forEach($scope[component.id + 's'], function (data, index, array) {
            if (data.id == id) {
                $scope[component.id] = data;
            }
        });

        if (!!component.callback && !!component.callback.update) {
            component.callback.update();
        }

        $('#' + component.id).modal('toggle');
    };

    /**
     * 保存
     * ---------------------------
     * */
    component.submit = function () {
        $scope[component.id + "form"].submitted = true;

        if ($scope[component.id + "form"].$valid) {

            $http.post(commons.getBusinessHostname() + component.server, $scope[component.id]).success(function (data, status, headers, config) {

                $('#' + component.id).modal('toggle');

                if (!!component.callback && !!component.callback.submit) {
                    component.callback.submit();
                }
                
                $scope[component.id + "s"].unshift(data.data);

                component.refresh();

                commons.success("保存成功")
            }).error(function (data, status, headers, config) { //     错误

                commons.modaldanger(component.id, "保存失败")
            });
        }
    };

    /**
     * 批量删除数据
     */
    component.removes = function () {
        var size = 0;

        angular.forEach(component.selection, function (value, key) {
            if (value == true) {
                size++;
            }
        });

        if (confirm("您确定要删除选中[" + size + "]条记录吗?")) {
            angular.forEach(component.selection, function (value, key) {
                if (value == true) {
                    component.delete(key);
                }
            });
        }

    };

    /**
     * 删除单条数据
     */
    component.remove = function (id) {
        if (confirm("您确定要删除该记录吗?")) {
            if (!id) {
                component.delete(component.selectedId);
            }
            else {
                component.delete(id);
            }
        }
    };

    /**
     * 具体的删除逻辑
     */
    component.delete = function (id) {
        $http.delete(commons.getBusinessHostname() + component.server + "/" + id).success(function (data, index, array) {

            angular.forEach($scope[component.id + "s"], function (elem) {
                if(elem.id == id)
                {
                    $scope[component.id + "s"].shift(elem);
                }
            });

            if (!!component.callback && !!component.callback.delete) {
                component.callback.delete();
            }

            component.refresh();

            commons.success("删除成功")

        }).error(function (data) {
            commons.danger("删除失败");
        });
    };

    /**
     * 刷新目录树
     * ---------------------------
     * */
    component.refresh = function () {
        component.search();
        component.treeConfig.version++;

    };

    /**
     * 初始化
     * ---------------------------
     * */
    component.init = function () {
        component.search();
    };
}).controller('ProductPopupCheckedPanelController', function ($scope, $controller, $http, commons) {

    /**
     * 商品&服务分类
     * ---------------------------
     * */
    $scope.producttypeportal= {

        text: "cateName", // 树标签-字段名

        parent: "parentId", // 父引用-字段名

        foreign: "producttype",

        foreignkey: "cateNo",

        id: "producttype",

        name: "商品&服务分类",

        server: "/api/v2/itemcates",

        callback: {
            switched: function () {
                // 加载
                $scope.productportal.search();
            },
            insert: function () {
                // 加载
                if (!$scope.producttypeportal.selectedId) {
                    $scope.producttype.parentId = "#";
                }
                else {
                    $scope.producttype.parentId = $scope.producttypeportal.selectedId;
                }
            },
            submit: function () {
                $scope.producttypeportal.search();
                $scope.producttypeportal.treeConfig.version++;
            },
            delete: function () {
                $scope.producttypeportal.search();
                $scope.producttypeportal.treeConfig.version++;
            }
        }
    };

    $controller('TreeSidePanelController', {$scope: $scope, component: $scope.producttypeportal}); //继承

    /**
     * 商品&服务
     * ---------------------------
     * */
    $scope.productportal= {

        foreign: "producttype", // 外键

        foreignkey: "cateNo",

        id: "product",

        name: "商品&服务",

        server: "/api/v2/itemtypes",

        defilters: {"itemCode": "商品编号", "itemName": "商品名称"}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.productportal}); //继承

}).controller('PetPopupCheckedPanelController', function ($scope, $controller, $http, commons) {

    /**
     * 弹出选择宠物
     * ---------------------------
     * */
    $scope.petportal= {

        id: "pet",

        name: "宠物选择",

        server: "/api/v2/pets",

        callback: {
            insert: function () {

            },
            update: function () {

            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.petportal}); //继承

    $scope.petportal.pupupselect = function () {
        $("#petselect").modal('toggle');
    };
    
    $scope.init = function () {
        $scope.petportal.search();
    };
});