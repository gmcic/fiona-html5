// 员工管理
angular.module('fiona').controller('PersonnelController', function ($scope, $http, commons, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        dicts: {personStatusSet: "会员状态"},

        userdicts: {sexSet: "性别"}
    };

    $scope.dropdowns = {
        isSyncEasSet: [{id: "true", valueNameCn: "是"}, {id: "false", valueNameCn: "否"}],
        roleSet: [{id: "doctor", valueNameCn: "医生"}, {id: "nurse", valueNameCn: "护士"}]
    };


    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropboxinit($scope.dropboxargs);

    /**
     * 员工管理
     * ---------------------------
     * */
    $scope.personnelportal = {

        id: "personnel",

        name: "员工管理",

        server: "/api/v2/personss",

        defilters: {
            "personCode": "员工编号",
            "personName": "员工名称 "
        },

        callback: {
            insert: function () {
                $scope.setSelectDefault("personnel", ["isSyncEas", "personStatus", "sex", "roleId"]);

                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=会员编号").success(function (data, status, headers, config) {

                    $scope.personnel.personCode = data.data;

                }).error(function (data, status, headers, config) { //     错误
                    commons.modaldanger("vip", "生成会员编号失败");
                });
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.personnelportal}); //继承

    $scope.personnelportal.filter();
});
