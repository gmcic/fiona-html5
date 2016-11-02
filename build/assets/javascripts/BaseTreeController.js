angular.module('fiona').controller('BaseTreeController', function ($scope, $controller, $http, commons) {
    // I'm the sibling, but want to act as parent

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    $controller('BaseController', {$scope: $scope}); //继承

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

    $scope.treeConfig = {
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

    $scope.treeEventsObj = {
        'select_node': function (e, item) {

            // // console.log(item.selected[0]);

            $scope.selectedId = item.selected[0];

            angular.forEach($scope.treeData, function (data) {
                if (data.id == $scope.selectedId) {
                    $scope.selected = data;
                }
            });

            $scope.search();
            // alert('select_node called: ' + item.selected);
        }
    };

    // 复选框
    $scope.selectedall = false;

    $scope.isRemoves = true;

    $scope.selection = {};

    $scope.selectChange = function () {
        $scope.isRemoves = true;
        angular.forEach($scope.selection, function (value, key) {
            if (value == true) {
                $scope.isRemoves = false;
            }
        });
    };

    $scope.selectAll = function () {
        angular.forEach($scope[$scope.master.id + 's'], function (data) {
            $scope.selection[data.id] = $scope.selectedall;
        })

        $scope.isRemoves = !$scope.selectedall
    };

    $scope.setDatumType = function (id) {
        $scope.selectedId = id;

        angular.forEach($scope.datumtypes, function (data) {
            if (data.id == $scope.selectedId) {
                $scope.selected = data;
            }
        });
    };

    // 加载侧边分类
    $scope.sideload = function () {

        $http.get(commons.getBusinessHostname() + $scope.slave.server).success(function (data, status, headers, config) {

            // console.log(data.data)

            angular.forEach(data.data, function (item) {
                item.text = item[$scope.slave.text];
                item.parent = item[$scope.slave.parent] || "#";
                // item.parent = "#";
                // console.log("Text: " + item.text)
                // console.log("Parent: " + item.parent)
            });

            $scope.treeData = data.data;

            $scope.treeConfig.version++;
        });
    };

    // 综合搜索项
    $scope.pagination = {
        'pageSize': 5,
        'pageNumber': 1,
        "first": true,
        "last": false,
        "totalElements": 1,
        "totalPages": 1
    };

    // 根据选择项进行过滤
    $scope.filterSelected = function () {
        var _filter;

        angular.forEach($scope.filters, function (filter) {
            if (filter.fieldName == $scope.slave.foreignkey) {
                _filter = filter;
            }
        });

        if (!_filter) {
            _filter = {"fieldName": $scope.slave.foreignkey, "operator": "EQ", "value": $scope.selectedId};

            $scope.filters.push(_filter);
        }
        else {
            _filter.value = $scope.selectedId;
        }

        return _filter;
    };

    // 初始化数据
    $scope.search = function () {

        // {'pageSize':$scope.pagination.pageSize, 'pageNumber':$scope.pagination.pageNumber, 'filters':$scope.filters}

        if (!!$scope.selectedId) {
            $scope.filterSelected();
        }

        // $scope.filters.pageNumber = 1;

        // $scope.filter.push({"fieldName": $scope.slave.foreignkey, "operator": "EQ", "value": $scope.selected});

        // console.log({
        //     'pageSize': $scope.pagination.pageSize,
        //     'pageNumber': $scope.pagination.pageNumber,
        //     'filters': $scope.filters
        // });
        
        $http.post(commons.getBusinessHostname() + $scope.master.server + "/page", {
            'pageSize': $scope.pagination.pageSize,
            'pageNumber': $scope.pagination.pageNumber,
            'filters': $scope.filters
        }).success(function (data, status, headers, config) {
            $scope[$scope.master.id + 's'] = data.data.content;

            // 搜索+分页
            $scope.pagination.pageNumber = data.data.number + 1;

            $scope.pagination.last = data.data.last;
            $scope.pagination.first = data.data.first;
            $scope.pagination.totalPages = data.data.totalPages;
            $scope.pagination.totalElements = data.data.totalElements;
        });
    };

    // Form 界面
    $scope.detail = function (id) {
        $http.post(commons.getBusinessHostname() + '/api/v2/dicttypedetails', {
            'pageSize': 0,
            'pageNumber': 0,
            'filters': [{"fieldName": "dictTypeId", "value": id, "operator": "EQ"}]
        }).success(function (data, status, headers, config) {
            $scope.userdicts = data;
        });
    };

    // Form 界面
    $scope.insert = function () {

        $scope[$scope.master.id + 'form'].submitted = false;

        // 添加
        $scope[$scope.master.id] = {
            "itemStyle": $scope.selected.text,
            "createUserId": "1",
            "updateUserId": "1"
        };

        $scope[$scope.master.id][$scope.slave.foreignkey] = $scope.selected.id;

        if (!!$scope.master.insert) {
            $scope.master.insert();
        }

        $('#' + $scope.master.id).modal('toggle');
    };

    $scope.update = function (id) {

        $scope[$scope.master.id + 'form'].submitted = false;

        angular.forEach($scope[$scope.master.id + 's'], function (data, index, array) {
            if (data.id == id) {
                $scope[$scope.master.id] = data;
            }
        });

        if (!!$scope.master.update) {
            $scope.master.update();
        }

        $('#' + $scope.master.id).modal('toggle');
    };

    $scope[$scope.master.id + 'submit'] = function () {

        $scope[$scope.master.id + 'form'].submitted = true;

        if ($scope[$scope.master.id + 'form'].$valid) {

            $http.post(commons.getBusinessHostname() + $scope.master.server, $scope[$scope.master.id]).success(function (data, status, headers, config) {

                $('#' + $scope.master.id).modal('toggle');

                $scope.search();
                
                if (!!$scope.master.submit) {
                    $scope.master.submit();
                }

                commons.success("保存成功")

            }).error(function (data, status, headers, config) { //     错误
                commons.modaldanger($scope.master.id, "保存表单失败");
            });
        }
        else {

            // console.log($scope[$scope.master.id+ 'form'].$error);
            alert('ValidError');
        }
    };

    // 删除功能
    $scope.removes = function () {
        var size = 0;

        angular.forEach($scope.selection, function (value, key) {
            if (value == true) {
                size++;
            }
        });

        if (confirm("您确定要删除选中[" + size + "]条记录吗?")) {
            angular.forEach($scope.selection, function (value, key) {
                if (value == true) {
                    $scope.delete(key);
                }
            });
        }
    };

    $scope.remove = function (id) {
        if (confirm("您确定要删除该记录吗?")) {
            $scope.delete(id);
        }
    };

    // 具体的删除逻辑
    $scope.delete = function (id) {
        $http.delete(commons.getBusinessHostname() + $scope.master.server + "/" + id).success(function (data, index, array) {

            $scope.search();

            commons.success("删除成功")

        }).error(function (data) {
            commons.danger("删除失败");
        });
    }

    $scope[$scope.slave.id + "insert"] = function () {

        $scope[$scope.slave.id + "form"].submitted = false;

        // 添加
        $scope[$scope.slave.id] = {"parentId": $scope.selectedId, "createUserId": "1", "updateUserId": "1"};

        $('#' + $scope.slave.id).modal('toggle');
    };

    $scope[$scope.slave.id + "update"] = function () {

        $scope[$scope.slave.id + "form"].submitted = false;

        $scope[$scope.slave.id] = $scope.selected;

        $('#' + $scope.slave.id).modal('toggle');
    };

    $scope[$scope.slave.id + "update"] = function () {

        $scope[$scope.slave.id + "form"].submitted = false;

        $scope[$scope.slave.id] = $scope.selected;

        $('#' + $scope.slave.id).modal('toggle');
    };

    $scope[$scope.slave.id + "submit"] = function () {

        // $scope[$scope.slave.id] = {"typeName": "吉娃娃", "floristicf": "犬科"};

        // alert($scope[$scope.slave.id].typeName  +  " | " + $scope[$scope.slave.id].floristicf);

        $scope[$scope.slave.id + "form"].submitted = true;

        if ($scope[$scope.slave.id + "form"].$valid) {

            $http.post(commons.getBusinessHostname() + $scope.slave.server, $scope[$scope.slave.id]).success(function (data, status, headers, config) {

                $('#' + $scope.slave.id).modal('toggle');

                $scope.sideload();

                commons.success("保存成功")
            }).error(function (data, status, headers, config) { //     错误

                commons.modaldanger($scope.slave.id, "保存失败")
            });
        }
    };

    $scope[$scope.slave.id + "remove"] = function (id) {
        if (confirm("您确定要删除该记录吗?")) {
            $http.delete(commons.getBusinessHostname() + $scope.slave.server + "/" + $scope.selectedId).success(function (data, index, array) {

                $scope.sideload();

                commons.success("删除成功")

            }).error(function (data) {
                commons.danger("删除失败");
            });
        }
    };
}).controller('TreePanelController', function ($scope, component, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

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

            // // console.log(item.selected[0]);

            component.selectedId = item.selected[0];

            angular.forEach($scope[component.id + "s"], function (data) {
                if (data.id == component.selectedId) {
                    component.selected = data;
                    $scope[component.id] = data;
                }
            });

            console.log($scope[component.id]);

            if (!!component.selectNode) {
                component.selectNode();
            }
            
            // component.search();
            // alert('select_node called: ' + item.selected);
        }
    };

    /**
     * 加载树数据
     * ---------------------------
     * */
    component.search = function () {

        $http.get(commons.getBusinessHostname() + component.server).success(function (data, status, headers, config) {

            angular.forEach(data.data, function (item) {
                item.text = item[component.text];
                item.parent = item[component.parent] || "#";
                // item.parent = "#";
                // console.log("Text: " + item.text)
                // console.log("Parent: " + item.parent)
            });

            $scope[component.id + 's'] = data.data;

            // console.log($scope[component.id + 's']);
            
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
    $scope.submit = function () {
        $scope[component.id + "form"].submitted = true;

        if ($scope[component.id + "form"].$valid) {

            $http.post(commons.getBusinessHostname() + $scope.server, $scope[component.id]).success(function (data, status, headers, config) {

                $('#' + component.id).modal('toggle');

                $scope.sideload();

                commons.success("保存成功")
            }).error(function (data, status, headers, config) { //     错误

                commons.modaldanger(component.id, "保存失败")
            });
        }
    };

    /**
     * 删除
     * ---------------------------
     * */
    component.remove = function (id) {
        if (confirm("您确定要删除该记录吗?")) {
            $http.delete(commons.getBusinessHostname() + component.server + "/" + id).success(function (data, index, array) {

                if (!!component.callback && !!component.callback.remove) {
                    component.callback.remove();
                }

                commons.success("删除成功")

            }).error(function (data) {
                commons.danger("删除失败");
            });
        }
    };

    /**
     * 初始化
     * ---------------------------
     * */
    component.init= function () {
        component.search();
    };
}).controller('TablePaginationPanelController', function ($scope, component, $controller, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    // Component 组件必填属性声明
    component.vars = {
        foreignkey: true,
        foreign: true,
        id: true,
        name: true,
        server: true,
        callback: {search: false, insert: false, update: false}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: component}); //继承

    /**
     * 初始化
     * ---------------------------
     * */
    component.init= function () {
        component.search();
    };
});