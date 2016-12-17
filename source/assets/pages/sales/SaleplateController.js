
// 销售查询
angular.module('fiona').controller('SaleplateController', function($scope, $controller) {

    $scope.dropdowns = { };

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 销售查询
     * ---------------------------
     * */
    $scope.saleplateportal = {

        foreign: "saleplatedetail", // 外键

        foreignkey: "directSellCode",

        id: "saleplate",

        name: "销售查询",

        server: "/api/v2/storedirectsells",

        defilters: { directSellCode: "销售单号", gestCode: "会员编号", gestName: "会员姓名", petName: "宠物名称"},

        callback: {
            view: function(){
                $scope.saleplatedetailportal.searchAll();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.saleplateportal}); //继承

    /**
     * 直接销售明细
     * ---------------------------
     * */
    $scope.saleplatedetailportal = {

        foreign: "saleplate", // 外键

        foreignkey: "directSellCode",

        id: "saleplatedetail",

        name: "直接销售明细",

        server: "/api/v2/storedirectselldetails",

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.saleplatedetailportal}); //继承


    $scope.saleplateportal.filter();

});
