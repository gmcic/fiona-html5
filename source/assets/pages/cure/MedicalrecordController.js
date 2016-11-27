
// 宠物管理
angular.module('fiona').controller('MedicalrecordController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {companyTypeSet: [{id: "1", valueNameCn: "经销商"}, {id: "2", valueNameCn: "生产商"}, {id: "3", valueNameCn: "经销商和生产商"}]};

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