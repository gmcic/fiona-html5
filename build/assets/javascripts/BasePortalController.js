angular.module('fiona').controller('BasePortalController', function ($scope, component, $http, commons) {
    // I'm the sibling, but want to act as parent

        $http.defaults.headers.post.authorization = commons.getAuthorization();

        $http.defaults.headers.post['Content-Type'] = 'application/json';

        component.dropboxinit = function (args) {

            // alert(args);

            var dicts = {dict: {}, filter: []};

            var userdicts = {dict: {}, filter: []};

            angular.forEach(args, function (arg) {
                if(arg.server == 'dicts')
                {
                    dicts.dict[arg.filterName] = arg.name;
                    dicts.filter.push(arg.filterName);
                }
                else if(arg.server == 'userdicts')
                {
                    userdicts.dict[arg.filterName] = arg.name;
                    userdicts.filter.push(arg.filterName);
                }
                else {
                    $http.get(commons.getBusinessHostname() + "/api/v2/" + arg.server).success(function (data, status, headers, config) {
                        component.dropdowns[arg.name] = data.data;
                    });
                }
            });

            component.loadUserdicts(userdicts);

            component.loadDicts(dicts);
        };

        /**
         * 读取下拉选项
         */
        component.loadUserdicts = function (userdicts) {
            angular.forEach(userdicts.filter, function (name) {
                $http.post(commons.getBusinessHostname() + "/api/v2/userdicts/page", { 'pageSize': 1,'pageNumber': 1,'filters': [{"fieldName": "dictName", "value": name, "operator": "EQ"}]
                }).success(function (data, status, headers, config) {
                    angular.forEach(data.data.content, function (data) {
                        $http.post(commons.getBusinessHostname() + "/api/v2/userdictdetails/page", { 'pageSize': 100, 'pageNumber': 1, 'filters': [{"fieldName": "dictTypeId", "value": data.id, "operator": "EQ"}]
                        }).success(function (datadetail, status, headers, config) {
                            component.dropdowns[userdicts.dict[name]] = datadetail.data.content;
                        });
                    });
                });
            });
        };

        /**
         * 读取下拉选项
         */
        component.loadDicts = function (dict) {
            angular.forEach(dict.filter, function (name) {
                $http.post(commons.getBusinessHostname() + "/api/v2/dicttypes/page", { 'pageSize': 1, 'pageNumber': 1, 'filters': [{"fieldName": "dictName", "value": name, "operator": "EQ"}]
                }).success(function (data, status, headers, config) {
                    angular.forEach(data.data.content, function (data) {
                        $http.post(commons.getBusinessHostname() + "/api/v2/dicttypedetails/page", { 'pageSize': 100, 'pageNumber': 1, 'filters': [{"fieldName": "dictTypeId", "value": data.id, "operator": "EQ"}]
                        }).success(function (datadetail, status, headers, config) {
                            component.dropdowns[dict.dict[name]] = datadetail.data.content;
                        });
                    });
                });
            });
        };

        // 会员等级, 会员状态
        component.dropboxinit(component.dropboxargs);

        // 复选框
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
            // console.log(component.selection);

            angular.forEach($scope[component.master.id + 's'], function (data) {
                component.selection[data.id] = component.selectedall;
            })

            component.isRemoves = !component.selectedall
        };

        // 初始化数据
        component.search = function (master_id) {
            $http.post(commons.getBusinessHostname() + component.master.server + "/page", {'pageSize':10000, 'pageNumber':1,'filters': [{"fieldName": component.master.foreignkey, "value": master_id, "operator": "EQ"}]}).success(function (data, status, headers, config) {

                // console.log("Portal: " + component.master.id + 's')

                // console.log(data.data.content)

                $scope[component.master.id + 's'] = data.data.content;
            });
        };

        // 添加
        component.insert = function () {

            $scope[component.master.id + "form"].submitted = false;

            // 添加
            $scope[component.master.id] = {"createUserId": "1", "updateUserId": "1"};

            console.log("Debug: " + component.master.id);
            console.log($scope[component.master.id]);
            console.log("Debug: foreignkey = " + component.master.foreignkey);

            console.log("Debug: " + component.parent.id);
            console.log($scope[component.parent.id]);
            console.log("Debug" + component.parent.id + " = " + $scope[component.parent.id].id)
            
            $scope[component.master.id][component.master.foreignkey] = $scope[component.parent.id].id;

            if (!!component.master.insert) {
                component.master.insert();
            }
            
            $('#' + component.master.id).modal('toggle');
        };

        // 修改
        component.update = function (id) {

            $scope[component.master.id + "form"].submitted = false;

            angular.forEach($scope[component.master.id + "s"], function (data) {

                if(data.id == id)
                {
                    $scope[component.master.id] = data;
                }
            });

            if (!!component.master.update) {
                component.master.update();
            }
            
            $('#' + component.master.id).modal('toggle');
        };

        // 保存
        component.submit = function () {

            $scope[component.master.id + "form"].submitted = true;

            if ($scope[component.master.id  + "form"].$valid) {

                var updateflag = !$scope[component.master.id].id

                $http.post(commons.getBusinessHostname() + component.master.server, $scope[component.master.id]).success(function (data, status, headers, config) {

                    if(updateflag)
                    {
                        $scope[component.master.id + "s"].unshift(data.data);
                    }

                    $('#' + component.master.id).modal('toggle');

                    if (!!component.master.submit) {
                        component.master.submit();
                    }

                    commons.modalsuccess(component.parent.id, "保存成功")

                }).error(function (data, status, headers, config) { //     错误

                    commons.modaldanger(component.master.id, "保存失败")
                });
            }
        };

    // 删除功能
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

        component.remove = function (id) {
            if (confirm("您确定要删除该记录吗?")) {
                component.delete(id);
            }
        };

        // 具体的删除逻辑
        component.delete = function (id) {
            $http.delete(commons.getBusinessHostname() + component.master.server +"/"+ id).success(function (data, index, array) {


                angular.forEach($scope[component.master.id + "s"], function (elem) {

                    if(elem.id == id)
                    {
                        $scope[component.master.id + "s"].shift(elem);
                    }
                });

                // $scope.search();

                commons.modalsuccess(component.parent.id, "删除成功")

            }).error(function (data) {
                commons.modaldanger(component.parent.id, "删除失败")
            });
        };
}).controller('TreeSidePortalController', function ($scope, component, $http, commons) {
    // I'm the sibling, but want to act as parent

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    // I'm the sibling, but want to act as parent
    // 综合搜索项
    component.pagination = {
        'pageSize': 10,
        'pageNumber': 1,
        "first": true,
        "last": false,
        "totalElements": 1,
        "totalPages": 1
    };

    // 初始化
    component.init= function () {
        component.treeload();
        component.search();
    };

    component.pageFilterText = "";

    // 复选框
    component.selectedall = false;

    component.isRemoves = true;

    component.selection = {};

    component.selectChange = function () {

        // console.log(component.selection);

        component.isRemoves = true;
        angular.forEach(component.selection, function (value, key) {
            if (value == true) {
                component.isRemoves = false;
            }
        });
    };

    component.selectAll = function () {
        // console.log(component.selection);

        angular.forEach($scope[component.master.id + 's'], function (data) {
            component.selection[data.id] = component.selectedall;
        })

        component.isRemoves = !component.selectedall
    };


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

    component.treeEventsObj = {
        'select_node': function (e, item) {

            // // console.log(item.selected[0]);
            component.selectedId = item.selected[0];

            angular.forEach(component.treeData, function (data) {
                if (data.id == component.selectedId) {
                    component.selected = data;
                }
            });

            component.search();
            // alert('select_node called: ' + item.selected);
        }
    };

    // 加载侧边分类
    component.treeload = function () {

        $http.get(commons.getBusinessHostname() + component.slave.server).success(function (data, status, headers, config) {

            // console.log(data.data)

            angular.forEach(data.data, function (item) {
                item.text = item[component.slave.text];
                item.parent = item[component.slave.parent] || "#";
                // item.parent = "#";
                // console.log("Text: " + item.text)
                // console.log("Parent: " + item.parent)
            });

            component.treeData = data.data;

            component.treeConfig.version++;
        });
    };

    // 根据选择项进行过滤
    component.createFilter = function () {
        var _filters = [];

        if(!!component.pageFilterText)
        {
            angular.forEach(component.filters, function (filter) {
                filter.value = component.pageFilterText;
                _filters.push(filter);
            });
        }

        if (!!component.selectedId) {
            _filters.push({"fieldName": component.slave.foreignkey, "operator": "EQ", "value": component.selectedId});
        }

        return _filters;
    };

    // 添加
    component.insert = function () {
        $('#' + component.master.id).modal('toggle');
    };
    
    // 选择
    component.selectrow = function (id) {
        alert(id);
    };

    // 保存
    component.submit = function () {
        if(!!component.master.submit)
        {
            var selected = [];

            angular.forEach(component[component.master.id + "s"], function (data) {
                if(component.selection[data.id])
                {
                    selected.push(data);
                }
            });

            component.master.submit(selected);
        }

        $('#' + component.master.id).modal('toggle');
    };

    // 初始化数据
    component.search = function () {

        // console.log({
        //     'pageSize': component.pagination.pageSize,
        //     'pageNumber': component.pagination.pageNumber,
        //     'filters': component.createFilter()
        // });

        $http.post(commons.getBusinessHostname() + component.master.server + "/page", {
            'pageSize': component.pagination.pageSize,
            'pageNumber': component.pagination.pageNumber,
            'filters': component.createFilter()
        }).success(function (data, status, headers, config) {

            // console.log("Component: debug");
            // console.log(component[component.master.id + 's']);

            component[component.master.id + 's'] = data.data.content;

            // 搜索+分页
            component.pagination.pageNumber = data.data.number + 1;

            component.pagination.last = data.data.last;
            component.pagination.first = data.data.first;
            component.pagination.totalPages = data.data.totalPages;
            component.pagination.totalElements = data.data.totalElements;
        });
    };
}).controller('ProductPopupSelectController', function ($scope, $controller, $http, commons) {

    // 选择商品
    $scope.productportal = {
        slave: {
            text: "cateName",

            parent: "parentId",

            foreignkey: "cateNo",         // id = {master.foreignkey}

            id: "producttype",

            name: "化验项目",

            server: "/api/v2/itemcates"
        },

        // 主数据加载地址
        master: {
            id: "product",

            name: "商品&服务",

            server: "/api/v2/itemtypes"
        },

        // 综合搜索项
        filters : [{"fieldName": "itemCode","operator": "EQ", "value":""} , {"fieldName": "itemName","operator": "EQ", "value":""}],

        placeholder : "请输入宠物病例号/宠物昵称/会员编号/会员名称/会员电话"

    };

    $controller('TreeSidePortalController', {$scope: $scope, component: $scope.productportal}); //继承

}).controller('PetPopupSelectController', function ($scope, $controller, $http, commons) {

    // 选择宠物
    $scope.petportal = {
        dropdowns: {},

        dropboxargs : [
            {name: "gestStyleSet", server: "gestlevels"},
            {name: "statusSet", server: "dicts", filterName: "会员状态"},
            {name: "gestSexSet", server: "userdicts", filterName: "性别"}
        ],

        master: {
            id: "pet",

            name: "宠物",

            server: "/api/v2/pets"
        },

        parent: {
            id: "inhospital"
        }
    };

    $controller('CommonVipController', {$scope: $scope, component: $scope.petportal}); //继承

}).controller('SidePortalController', function ($scope, component, $http, commons) {

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    // 复选框
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
        angular.forEach($scope[component.master.id + 's'], function (data) {
            component.selection[data.id] = component.selectedall;
        });

        component.isRemoves = !component.selectedall
    };

    component.setDatumType = function (id) {
        component.selectedId = id;

        angular.forEach(component.datumtypes, function (data) {
            if (data.id == component.selectedId) {
                component.selected = data;
            }
        });
    };

    // 初始化数据
    component.init = function () {
        // 分类
        $http.get(commons.getBusinessHostname() + component.slave.server).success(function (data, status, headers, config) {
            component.datumtypes = data.data;

            component.selected = component.datumtypes[0];

            component.selectedId = component.datumtypes[0].id;

            // 主数据
            component.search();
        });
    };

    // 初始化数据
    component.search = function () {
        // 详情
        $http.get(commons.getBusinessHostname() + component.master.server).success(function (data, status, headers, config) {
            $scope[component.master.id + 's'] = data.data;
        });
    };

    // Form 界面
    component.detail = function (id) {
        $http.post(commons.getBusinessHostname() + '/api/v2/dicttypedetails', {
            'pageSize': 0,
            'pageNumber': 0,
            'filters': [{"fieldName": "dictTypeId", "value": id, "operator": "EQ"}]
        }).success(function (data, status, headers, config) {
            component.userdicts = data;
        });
    };

    /**
     * 添加
     */
    component.insert = function () {

        $scope[component.master.id + 'form'].submitted = false;

        $scope[component.master.id] = {"createUserId": "1", "updateUserId": "1"};

        if (!!component.master.foreignobj) {
            $scope[component.master.id][component.master.foreignobj] = component.selected;
        }

        if (!!component.master.foreignkey)
        {
            $scope[component.master.id][component.master.foreignkey] = component.selectedId;
        }

        if (!!component.master.insert) {
            component.master.insert();
        }

        $('#' + component.master.id).modal('toggle');
    };

    /**
     * 修改
     */
    component.update = function (id) {

        $scope[component.master.id + 'form'].submitted = false;

        angular.forEach($scope[component.master.id + 's'], function (data, index, array) {
            if (data.id == id) {
                $scope[component.master.id] = data;
            }
        });

        if (!!component.master.update) {
            component.master.update();
        }

        $('#' + component.master.id).modal('toggle');
    };

    /**
     * 保存表单
     */
    component.submit = function () {

        $scope[component.master.id + 'form'].submitted = true;

        if ($scope[component.master.id + 'form'].$valid) {

            $http.post(commons.getBusinessHostname() + component.master.server, $scope[component.master.id]).success(function (data, status, headers, config) {

                $('#' + component.master.id).modal('toggle');

                component.search();

                if (!!component.master.submit) {
                    component.master.submit();
                }

                commons.success("保存成功")

            }).error(function (data, status, headers, config) { //     错误
                commons.modaldanger(component.master.id, "保存表单失败");
            });
        }
        else {
            alert('ValidError');
        }
    };

    // 删除功能
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

    component.remove = function (id) {
        if (confirm("您确定要删除该记录吗?")) {
            component.delete(id);
        }
    };

    // 具体的删除逻辑
    component.delete = function (id) {
        $http.delete(commons.getBusinessHostname() + component.master.server + "/" + id).success(function (data, index, array) {

            component.search();

            commons.success("删除成功")

        }).error(function (data) {
            commons.danger("删除失败");
        });
    };

});