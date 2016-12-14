
// 宠物管理
angular.module('fiona').controller('MedicalrecordController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= { };

    commons.findDict($scope.dropdowns, {companyTypeSet: "厂家类型"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 驱虫疫苗
     * ---------------------------
     * */
    $scope.medicalrecordportal= {

        id: "medicalrecord",

        name: "病案管理",

        defilters: { "code": "自动编号"},

        server: "/api/v2/medicvaccines",

        callback: {
            insert: function () {
                $scope.setSelectDefault("medicalrecord", ["companyType"]);

                $scope.serialNumber({id: "medicalrecord", fieldName : "code", numberName : "经销商编号"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.medicalrecordportal}); //继承

    $scope.medicalrecordportal.list();

});