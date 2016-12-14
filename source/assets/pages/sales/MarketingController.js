
// 直接销售
angular.module('fiona').controller('MarketingController', function($scope, $controller) {

    $scope.dropdowns= {};

    commons.findDict($scope.dropdowns, {petRaceNameSet: "厂家类型"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 销售查询
     * ---------------------------
     * */
    $scope.marketingportal= {

        id: "marketing",

        name: "销售查询",

        defilters: { "code": "自动编号" , "name": "经销商名称" , "contractMan": "联系人" , "mobilePhone": "手机" , "marketingAddress": "地址"  },

        server: "/api/v2/storedirectsells",

        callback: {
            insert: function () {
                $scope.setSelectDefault("marketing", ["companyType"]);

                $scope.serialNumber({id: "marketing", fieldName : "code", numberName : "经销商编号"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.marketingportal}); //继承

});
