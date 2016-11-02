angular.module('fiona').controller('CommonVipController', function ($scope, component, $http, commons) {
    // I'm the sibling, but want to act as parent

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    component.dropboxinit = function (args) {

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

    // 初始化数据
    component.search = function () {
        $http.post(commons.getBusinessHostname() + component.master.server + "/page", {'pageSize':10000, 'pageNumber':1}).success(function (data, status, headers, config) {
            $scope[component.master.id + 's'] = data.data.content;
        });

        $('#' + component.master.id + "select").modal('toggle');
    };

    // 添加
    component.insert = function () {

        $scope[component.master.id + "form"].submitted = false;

        // 添加
        $scope[component.master.id] = {"createUserId": "1", "updateUserId": "1"};

        if (!!component.master.insert) {
            component.master.insert();
        }

        $('#' + component.master.id).modal('toggle');
    };

    // 修改
    component.checked = function (id) {

        angular.forEach($scope[component.master.id + "s"], function (data) {

            if(data.id == id)
            {
                $scope[component.master.id] = data;
            }
        });

        if (!!component.master.checked) {
            component.master.checked();
        }

        $('#' + component.master.id + "select").modal('toggle');
    };


    /**
     * 修改
     */
    component.get= function (id) {
        $http.get(commons.getBusinessHostname() + component.master.server + "/" + id).success(function (data, status, headers, config) {
            $scope[component.master.id] = data.data;
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(component.master.id, "加载内容失败")
        });
    };

    // 保存
    component.submit = function () {

        $scope[component.master.id + "form"].submitted = true;

        if ($scope[component.master.id  + "form"].$valid) {

            $http.post(commons.getBusinessHostname() + component.master.server, $scope[component.master.id]).success(function (data, status, headers, config) {

                $scope[component.master.id] = data.data;

                $('#' + component.master.id).modal('toggle');

                if (!!component.master.submit) {
                    component.master.submit();
                }

                commons.modalsuccess(component.master.id, "保存成功")

            }).error(function (data, status, headers, config) { //     错误

                commons.modaldanger(component.master.id, "保存失败")
            });
        }
    };
}).controller('SaleVipController', function ($scope, component, $http, commons) {
    // 销售选择会员/散客

    $http.defaults.headers.post.authorization = commons.getAuthorization();

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    component.purchaserType = 1;

    // 初始化数据
    component.search = function () {
        $http.post(commons.getBusinessHostname() + component.master.server + "/page", {'pageSize':10000, 'pageNumber':1}).success(function (data, status, headers, config) {
            $scope[component.master.id + 's'] = data.data.content;
        });

        $('#' + component.master.id + "select").modal('toggle');
    };

    // 选择
    component.checked = function (id) {

        angular.forEach($scope[component.master.id + "s"], function (data) {

            if(data.id == id)
            {
                $scope[component.master.id] = data;
            }
        });

        if (!!component.master.checked) {
            component.master.checked();
        }

        $('#' + component.master.id + "select").modal('toggle');
    };

    /**
     * 修改
     */
    component.get= function (id) {
        $http.get(commons.getBusinessHostname() + component.master.server + "/" + id).success(function (data, status, headers, config) {
            $scope[component.master.id] = data.data;
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(component.master.id, "加载内容失败")
        });
    };

    /**
     * 取消选择
     */
    component.cancel= function () {
        $scope[component.master.id] = {};

        if (!!component.master.cancel) {
            component.master.cancel();
        }

    };
    /**
     * 选择
     */
    component.purchaser= function () {
        $scope[component.master.id] = {};

        if (!!component.master.cancel) {
            component.master.cancel();
        }

    };

});