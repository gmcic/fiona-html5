// 根据ID 搜索数组中指定的对象
Array.prototype.indexOfWithId = function(val) {
    if(val)
    {
        for (var i = 0; i < this.length; i++) {
            if (this[i].id == val.id) return i;
        }
    }

    return -1;
};

// 测试指定属性值的对象
Array.prototype.existprop = function(propertyName, value) {
    if(value)
    {
        for (var i = 0; i < this.length; i++) {
            if (this[i][propertyName] == value)
            {
                return true;
            }
        }
    }

    return false;
};

Array.prototype.unique = function(propertyName, value) {
    if(value)
    {
        for (var i = 0; i < this.length; i++) {
            if (this[i][propertyName] == value)
            {
                return this[i];
            }
        }
    }

    return nil;
};

// 根据ID 替换对象
Array.prototype.replaceById = function(obj) {

    var index = this.indexOfWithId(obj);

    if(index != -1)
    {
        this[index] = obj;
    }
};

// 搜索数组中与 对象ID 相同的对象
Array.prototype.getObjectWithId = function(val) {
    if(val)
    {
        for (var i = 0; i < this.length; i++) {
            if (this[i].id == val.id)
            {
                return  this[i];
            }
        }
    }
    return null;
};

// 根据ID 搜索数组中id相同的对象
Array.prototype.findObjectWithProperty = function(key, value) {

    if(value)
    {
        for (var i = 0; i < this.length; i++) {
            if (this[i][key] == value)
            {
                return this[i];
            }
        }
    }

    return null;
};

// 查找指定ID值的对象
Array.prototype.getObjectWithIdValue = function(idvalue) {
    if(idvalue)
    {
        for (var i = 0; i < this.length; i++) {

            if (this[i].id == idvalue)
            {
                return this[i];
            }
        }
    }

    return null;
};

// 根据ID 删除数据指定的对象
Array.prototype.removeById = function(val) {
    var index = this.indexOfWithId(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 根据ID 删除数据指定的对象
Array.prototype.removeObject = function(obj) {

    if(obj)
    {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
            {
                this.splice(i, 1);
            }
        }
    }
};

angular.module('fiona')
// 拦截器(验证用户是否登录)
.factory('UserInterceptor', ["$q", "$window", "commons",function ($q, $window, commons, Auth) {
    return {
        request:function(config){

//                sessionStorage.setItem("authorization", "fc5db3b3-4063-4a12-a511-880ba19e4b58");

            // config.headers["authorization"] = "fc5db3b3-4063-4a12-a511-880ba19e4b58";

            // alert(("SessionStorage Auth : " + sessionStorage.getItem("authorization")));

            if(sessionStorage.getItem("authorization"))
            {
                config.headers.post = config.headers.post || {};
                config.headers.post['Content-Type']= 'application/json';
                config.headers["authorization"] = sessionStorage.getItem("authorization");
            }
            else
            {
                $window.location.href = "login.html";
            }

            // alert('OK' + SessionService.isAnonymous);

            return config;
        }
    };
}])
// 侧边栏
.controller('IndexController', function($scope, $http, commons) {

    // alert(sessionStorage.getItem("authorization"));

    if(sessionStorage.getItem("authorization")) {
        $http.get(commons.getAccountHostname() + "/api/v2/auth", {headers: {'authorization': sessionStorage.getItem("authorization")}}).success(function (data, status, headers, config ) {
            sessionStorage.setItem("userName", data.data.name);
            $scope.userName = sessionStorage.getItem("userName");
        }).error(function (data, status, headers, config) {
            console.log('加载用户信息失败');
        });

        $http.get(commons.getAccountHostname() + "/api/v2/menus").success(function (data, status, headers, config) {
            $scope.menus = data.data;
        }).error(function (data, status, headers, config) {
            alert('加载目录树失败');
        });
    }
})
.controller('BaseController', function ($scope, $http, commons) {

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

        // if(!!args.gestLevels)
        // {
        //     //会员等级
        //     $scope.selectDicts('gestlevels', invoke.gestLevels, args.gestLevels);
        // }
        
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


    /**
     * 设置下拉选项默认值
     * ---------------------------
     * */
    $scope.setSelectDefault = function (name, fieldNames) {
        angular.forEach(fieldNames, function (fieldName) {

            var keys = fieldName.split(".");

            if ($scope.dropdowns[keys[0] + "Set"]) {

                var type = $scope.dropdowns[keys[0] + "Set"][0];

                if(keys.length == 2 && keys[1])
                {
                    $scope[name][keys[0]] = type[keys[1]];
                }
                else if(type.personName)
                {
                    $scope[name][keys[0]] = type.id;
                }
                else if (!!type.itemCode) {
                    // product
                    $scope[name][keys[0]] = type.itemCode;
                }
                else if (!!type.valueNameCn) {
                    // dicttypes | dicts | custom
                    $scope[name][keys[0]] = type.id;
                }
            }
        });
    };

    $scope.setSelectDefaultObject = function (name, fieldNames) {
        angular.forEach(fieldNames, function (fieldName) {
            if (!!$scope.dropdowns[fieldName + "Set"]) {
                $scope[name][fieldName] = $scope.dropdowns[fieldName + "Set"][0];
            }
        });
    };

    /**
     * 下拉选项, 将查询出的对象替换为本地对象
     * ---------------------------
     * */
    $scope.replaceLocalObject = function (keyword, fieldNames) {
        angular.forEach(fieldNames, function(fieldName){
            if($scope[keyword][fieldName])
            {
                $scope[keyword][fieldName] = $scope.dropdowns[fieldName + "Set"].getObjectWithId($scope[keyword][fieldName]);
            }
        });
    };

    $scope.dropdownWithTable = function (component) {

        if(component.condition)
        {
            var filters = [];

            angular.forEach(component.condition, function(data, key){
                filters.push({"fieldName": key, "operator": "EQ", "value": data});
            });

            $http.post(commons.getBusinessHostname() + component.server+ "/page", { 'pageSize': 10000, 'pageNumber': 1, 'filters': filters})

            .success(function (data, status, headers, config) {
                var dropdown = [];

                if(component.value) {
                    angular.forEach(data.data.content, function (record) {
                        dropdown.push({id: record[component.value], valueNameCn: record[component.text]});
                    });
                }
                else {
                    dropdown = data.data.content;
                }

                // console.log(dropdown);

                $scope.dropdowns[component.id + "Set"] = dropdown;
            });
        }
        else
        {
            $http.get(commons.getBusinessHostname() + component.server).success(function (data, status, headers, config) {

                var dropdown = [];

                if(component.value) {
                    angular.forEach(data.data, function (record) {
                        dropdown.push({id: record[component.value], valueNameCn: record[component.text]});
                    });
                }
                else {
                    dropdown = data.data;
                }

                // console.log(dropdown);

                $scope.dropdowns[component.id + "Set"] = dropdown;
            });
        }

    };



    /**
     * 生成编号
     * ---------------------------
     * */
    $scope.serialNumber = function(component){
        // 生成-会员编号
        $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=" + component.numberName).success(function (data, status, headers, config) {

            $scope[component.id][component.fieldName]= data.data;

        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(component.id, "生成" +component.numberName+ "失败");
        });
    };

})
.controller('FilterController', function ($scope, component, $http, commons) {

    if(!component.filters)
    {
        component.filters = [];
    }

    // component.placeholder

    var _placeholder = "";

    if(!!component.defilters)
    {
        angular.forEach(component.defilters, function (value, key) {
            component.filters.push({"fieldName": key, "operator": "LIKE", "value":""});
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
                    "operator": "LIKE",
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


})
.controller('PaginationController', function ($scope, component, $http, commons) {

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

})
.controller('BaseCUDController', function ($scope, component, $http, commons) {

    // 添加 \ 个性 \ 删除

    /**
     * 添加
     * ---------------------------
     * */
    component.insert = function () {

        $scope[component.id + 'form'].submitted = false;

        // 添加
        $scope[component.id] = {};

        if(!!component.foreignkey && !!$scope[component.foreign])
        {
            $scope[component.id][component.foreignkey] = $scope[component.foreign][$scope[component.foreign + "portal"].foreignKey || 'id'];
        }

        if (!!component.callback && !!component.callback.insert) {
            component.callback.insert();
        }

        $('#' + component.id).modal('toggle');
    };

    component.selectchange = function (inputName, fieldName) {

        // 本对象字段名, 选择对象的字段名
        angular.forEach($scope.dropdowns[inputName  + 'Set'], function (data) {
            if($scope[component.id][inputName] == data[fieldName])
            {
                if(component.callback && component.callback.selectsync)
                {
                    component.callback.selectsync(inputName, data);
                }
            }
        });

    };

    /**
     * 变更
     * ---------------------------
     * */
    component.update = function (id) {

        $scope[component.id + 'form'].submitted = false;

        $scope[component.id] = $scope[component.id + 's'].getObjectWithIdValue(id);

//        angular.forEach($scope[component.id + 's'], function (data, index, array) {
//            if (data.id == id) {
//                $scope[component.id] = data;
//            }
//        });

//         console.log($scope[component.id]);

        if (!!component.callback && !!component.callback.update) {
            component.callback.update();
        }

        $('#' + component.id).modal('toggle');
    };

    /**
     * 查看
     * ---------------------------
     * */
    component.view = function (id) {

        angular.forEach($scope[component.id + 's'], function (data, index, array) {
            if (data.id == id) {
                $scope[component.id] = data;
            }
        });

        if (!!component.callback && !!component.callback.view) {
            component.callback.view();
        }

        $("#" + component.id + "view").modal('toggle');
    };

    /**
     * 获取惟一的记录
     * ---------------------------
     * */
    component.unique = function (id) {

        $http.get(commons.getBusinessHostname() + component.server + "/" + id).success(function (data, status, headers, config) {

            $scope[component.id] = data.data;

            if (!!component.callback && !!component.callback.unique) {
                component.callback.unique();
            }
        }).error(function (data, status, headers, config) {
            commons.modaldanger(component.id, "加载惟一的记录失败")
        });
    };

    /**
     * 提交保存
     * ---------------------------
     * */
    component.submit = function () {

        $scope[component.id + "form"].submitted = true;

        if (!!component.callback && !!component.callback.submitbefore) {
            component.callback.submitbefore();
        }

        if ($scope[component.id + "form"].$valid) {

            var isappend = !$scope[component.id].id;

            $http.post(commons.getBusinessHostname() + component.server, $scope[component.id]).success(function (data, status, headers, config) {

                $('#' + component.id).modal('toggle');

                $scope[component.id] = data.data;

                if (!!component.callback && !!component.callback.submit) {
                    component.callback.submit();
                }

                if(isappend && $scope[component.id + "s"])
                {
                    $scope[component.id + "s"].unshift(data.data);
                }

                commons.success("保存成功")
            }).error(function (data, status, headers, config) { //     错误

                commons.modaldanger(component.id, "保存失败")
            });
        }
    };

    /**
     * 直接保存
     * ---------------------------
     * */
    component.save = function () {

        $http.post(commons.getBusinessHostname() + component.server, $scope[component.id]).success(function (data, status, headers, config) {

            $scope[component.id] = data.data;

            if (!!component.callback && !!component.callback.save) {
                component.callback.save(data.data);
            }
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(component.id, "保存失败")
        });
    };

    component.saveWithEntity = function (entity) {

        $http.post(commons.getBusinessHostname() + component.server, entity).success(function (data, status, headers, config) {

        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(component.id, "保存失败")
        });
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
                    component.delete($scope[component.id+"s"].getObjectWithIdValue(key));
                }
            });
        }

    };

    /**
     * 删除单条数据
     */
    component.remove = function (obj) {

        obj = obj || $scope[component.id];

        if (confirm("您确定要删除该记录吗?")) {
            component.delete(obj);
        }
    };

    /**
     * 具体的删除逻辑
     */
    component.delete = function (obj) {

        if(obj.id)
        {
            $http.delete(commons.getBusinessHostname() + component.server + "/" + obj.id).success(function (data, index, array) {

                $scope[component.id + "s"].removeById(obj);

                if (!!component.callback && !!component.callback.delete) {
                    component.callback.delete();
                }

                commons.success("删除成功")

            }).error(function (data) {
                commons.danger("删除失败");
            });
        }
        else
        {
            $scope[component.id + "s"].removeObject(obj);

            if (!!component.callback && !!component.callback.delete) {
                component.callback.delete();
            }
        }
    };

    /**
     * 初始化
     * ---------------------------
     * */
    component.init= function () {
        // component.search();
    };

})
.controller('BaseCRUDController', function ($scope, component, $controller, $http, commons) {

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
     * 搜索不分页
     * ---------------------------
     * */
    component.list = function () {
        $http.get(commons.getBusinessHostname() + component.server).success(function (data, status, headers, config) {
            $scope[component.id + 's'] = data.data;

            if(!!component.callback && !!component.callback.list)
            {
                component.callback.list();
            }
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

            _filter = {"fieldName": component.foreignkey, "operator": "EQ", "value": $scope[component.foreign][$scope[component.foreign + "portal"].foreignKey || 'id']};

            component.filters.push(_filter);
        }
        else {
            _filter.value = $scope[component.foreign][$scope[component.foreign + "portal"].foreignKey || 'id'];
        }

        return _filter;
    };

    /**
     * 搜索
     * ---------------------------
     * */
    component.searchByWhere = function(condition, invoke){

        var filters = [];

        angular.forEach(condition, function(data, key){
            filters.push({"fieldName": key, "operator": "EQ", "value": data});
        });

        $http.post(commons.getBusinessHostname() + component.server + "/page", { 'pageSize': 10000, 'pageNumber': 1, 'filters': filters})
        .success(function (data, status, headers, config) {
            $scope[component.id + 's'] = data.data.content;

            if(invoke)
            {
                invoke.call();
            }
        });
    };

    /**
     * 分页搜索
     * ---------------------------
     * */
    component.search = function () {

        if (!!component.foreign && !!$scope[component.foreign] && !!$scope[component.foreign][$scope[component.foreign + "portal"].foreignKey || 'id']) {
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

})
.controller('SidePanelController', function ($scope, component, $controller, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    $controller('BaseCUDController', {$scope: $scope, component: component}); //继承

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
})
.controller('TreeSidePanelController', function ($scope, component, $controller, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    // $controller('BaseCUDController', {$scope: $scope, component: component}); //继承

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
     * 取消选中
     * ---------------------------
     * */
    component.cancelSelected = function () {
        component.selectedId = null;
        component.selected = null;
        $scope[component.id] = null;
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
        $scope[component.id] = {};

        if(!!component.foreignkey && !!$scope[component.foreign])
        {
            $scope[component.id][component.foreignkey] = $scope[component.foreign][$scope[component.foreign + "portal"].foreignKey || 'id'];
        }

        // 加载
        if (!component.selected) {
            $scope[component.id].parentObject = {};
            $scope[component.id].parentObject[component.parent] = "#";
            $scope[component.id].parentObject[component.text] = "顶级";
        }
        else {
            $scope[component.id].parentObject = component.selected;
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
    component.update = function () {

        $scope[component.id + 'form'].submitted = false;

        if((component.selected[component.parent] || "#") == "#")
        {
            $scope[component.id].parentObject = {};
            $scope[component.id].parentObject[component.parent] = "#";
            $scope[component.id].parentObject[component.text] = "顶级";
        }
        else{
            $scope[component.id].parentObject = $scope[component.id + 's'].getObjectWithIdValue(component.selected[component.parent]);

            console.log("$scope[component.id].parentObject");
            console.log(component.selected[component.parent]);
            console.log($scope[component.id].parentObject);
        }

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

//        console.log($scope[component.id]);

        delete $scope[component.id].parentObject;

        if (!!component.callback && !!component.callback.submitbefore) {
            component.callback.submitbefore();
        }

        if ($scope[component.id + "form"].$valid) {

            delete $scope[component.id].text;
            delete $scope[component.id].parent;

            $http.post(commons.getBusinessHostname() + component.server, $scope[component.id]).success(function (data, status, headers, config) {

                $('#' + component.id).modal('toggle');

                $scope[component.id] = data.data;

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
            angular.forEach(component.selection, function (obj, key) {
                if (value == true) {
                    component.delete(obj);
                }
            });
        }

    };

    /**
     * 删除单条数据
     */
    component.remove = function (obj) {

        obj = obj || $scope[component.id];

        if (confirm("您确定要删除该记录吗?")) {
            component.delete(obj);
        }
    };

    /**
     * 具体的删除逻辑
     */
    component.delete = function (obj) {

        if(obj.id)
        {
            $http.delete(commons.getBusinessHostname() + component.server + "/" + obj.id).success(function (data, index, array) {

                $scope[component.id + "s"].removeById(obj);

                if (!!component.callback && !!component.callback.delete) {
                    component.callback.delete();
                }

                component.refresh();

                commons.success("删除成功")

            }).error(function (data) {
                commons.danger("删除失败");
            });
        }
        else
        {
            $scope[component.id + "s"].removeById(obj);

            if (!!component.callback && !!component.callback.delete) {
                component.callback.delete();
            }
        }
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
})
.controller('ProductPopupCheckedPanelController', function ($scope, $controller, $http, commons) {

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
            insert: function(){
                $scope.setSelectDefault("producttype", ["busiTypeId"]);
                $scope.serialNumber({id: "producttype", fieldName : "cateNo", numberName : "服务类型"});
            },
            submitbefore: function () {
                delete $scope.producttype.text;
                delete $scope.producttype.parent;
            },
            submit: function () {
                $scope.producttypeportal.refresh()
            },
            delete: function () {
                $scope.producttypeportal.cancelSelected();
                $scope.producttypeportal.refresh()
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

        defilters: {"itemCode": "商品编号", "itemName": "商品名称", "inputCode": "拼音码"},

       callback: {
           insert: function () {

               $scope.product.busiTypeId = $scope.producttype.busiTypeId;

               $scope.product.itemStyle = $scope.producttype.cateName;

                $scope.serialNumber({id: "product", fieldName : "itemCode", numberName : "商品服务"});

               $scope.setSelectDefault("product", ["packageUnit", "drugForm", "isVipDiscount", "isSell", "isCount", "recipeUnit", "isCanExchange"]);
           }
       }
    };

    $scope.productportal.pupupselect = function () {

        $scope.productportal.selectedall = false;

        $scope.productportal.isRemoves = true;

        $scope.productportal.selection = {};

        $("#productselect").modal('toggle');
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.productportal}); //继承

})
.controller('ProductAutoCompleteController', function ($scope, $controller, $http, commons) {

    /**
     * 商品&服务
     * ---------------------------
     * */
    $scope.productportal = {

        foreign: "producttype", // 外键

        foreignkey: "cateNo",

        id: "product",

        name: "商品&服务",

        server: "/api/v2/itemtypes",

        defilters: {"itemCode": "商品编号", "itemName": "商品名称", "inputCode": "拼音码"},

       callback: {
           insert: function () {

               $scope.product.busiTypeId = $scope.producttype.busiTypeId;

               $scope.product.itemStyle = $scope.producttype.cateName;

                $scope.serialNumber({id: "product", fieldName : "itemCode", numberName : "商品服务"});

               $scope.setSelectDefault("product", ["packageUnit", "drugForm", "isVipDiscount", "isSell", "isCount", "recipeUnit", "isCanExchange"]);
           }
       }
    };

    // 商品选择
    $scope.onselectobject = function() {

        $http.get(commons.getBusinessHostname() + $scope.productportal.server + "/" + $scope.selectedProduct.originalObject.id).success(function (data, status, headers, config) {

            $scope.productportal.checked(data.data);

        }).error(function (data, status, headers, config) {
            commons.modaldanger($scope.productportal.id, "加载惟一的记录失败")
        });

        // 清除选中
        $scope.selectedProduct = {};

        $scope.searchStr = "";

        $('#productautocomplete_value').val("");
    };

    // 自动补全
    $scope.productportal.autocompletedata = function () {
        $http.get(commons.getBusinessHostname() + $scope.productportal.server + "/search").success(function (data, status, headers, config) {
            $scope[$scope.productportal.id + 's'] = data;
        });
    };

    // 弹出选择
    $scope.productportal.pupupselect = function () {

        $scope.productportal.selectedall = false;

        $scope.productportal.isRemoves = true;

        $scope.productportal.selection = {};

        $("#productselect").modal('toggle');
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.productportal}); //继承
})

.controller('PetPopupCheckedPanelController', function ($scope, $controller, $http, commons) {

    /**
     * 弹出选择宠物
     * ---------------------------
     * */
    $scope.petportal= {

        id: "pet",

        name: "宠物选择",

        defilters: {"sickFileCode": "宠物病历号",  "petName": "宠物昵称",  "gestCode": "会员编号",  "gestName": "会员姓名"},

//        ,  "gestName": "会员电话"
        server: "/api/v2/pets",

        callback: {
            insert: function () {
                $scope.setSelectDefault("pet", ["petBreed.valueNameCn"]);

                $scope.setSelectDefaultObject("pet", ["petSkinColor", "petSex", "petRace", "status"]);

                $scope.serialNumber({id: "pet", fieldName : "petCode", numberName : "宠物编号"});
            },
            update: function () {

                $scope.replaceLocalObject("pet", ["petSkinColor", "petSex", "petRace", "status"]);

                $scope.vipportal.unique($scope.pet.gestId);
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.petportal}); //继承

    $scope.petportal.pupupselect = function () {

        $scope.petportal.search();

        $("#petselect").modal('toggle');
    };

    $scope.petportal.checked = function (pet) {

        $scope.pet = pet;

        $scope.vipportal.unique($scope.pet.gestId);

        $("#petselect").modal('toggle');
    };


    $scope.init = function () {
        $scope.petportal.search();
    };

})
.controller('VipPopupCheckedPanelController', function ($scope, $controller, $http, commons) {

    /**
     * 弹出选择会员
     * ---------------------------
     * */
    $scope.vipportal= {

        id: "vip",

        name: "选择会员",

        server: "/api/v2/gests",

        defilters: {"gestCode": "会员编号",  "gestName": "会员名称",  "mobilePhone": "会员电话"},

        callback: {
            submit: function () {
                // 主人ID
                $scope.pet.gestId = $scope.vip.id;

                // 主人编号
                $scope.pet.gestCode = $scope.vip.gestCode;

                // 主人名称
                $scope.pet.gestName = $scope.vip.gestName;
            },

            insert: function () {
                // 生成-会员编号
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=会员编号").success(function (data, status, headers, config) {
                    $scope.vip.gestCode = data.data;
                }).error(function (data, status, headers, config) { //     错误
                    commons.modaldanger("vip", "生成会员编号失败");
                });

                angular.forEach(['gestSex', 'gestStyle', 'status'], function (key) {
                    $scope.vip[key] = $scope.dropdowns[key + 'Set'][0];
                });
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.vipportal}); //继承

    $scope.vipportal.pupupselect = function () {

        $scope.vipportal.search();

        $("#vipselect").modal('toggle');
    };

    $scope.vipportal.checked = function (vip) {

        $scope.vip = vip;

        // 主人ID
        $scope.pet.gestId = vip.id;

        // 主人编号
        $scope.pet.gestCode = vip.gestCode;

        // 主人名称
        $scope.pet.gestName = vip.gestName;

        $("#vipselect").modal('toggle');
    };

    // $scope.init = function () {
    //     $scope.vipportal.search();
    // };
});