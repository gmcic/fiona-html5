
// 经销商与生产商
angular.module('fiona').controller('DealerController', function($scope, $controller, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {companyTypeSet: [{id: "1", valueNameCn: "经销商"}, {id: "2", valueNameCn: "生产商"}, {id: "3", valueNameCn: "经销商和生产商"}]};

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 经销商与生产商
     * ---------------------------
     * */
    $scope.dealerportal= {

        id: "dealer",

        name: "经销商与生产商",

        defilters: { "code": "自动编号" , "name": "经销商名称" , "contractMan": "联系人" , "mobilePhone": "手机" , "dealerAddress": "地址"  },

        server: "/api/v2/dealers",

        callback: {
            insert: function () {
                $scope.setSelectDefault("dealer", ["companyType"]);

                $scope.serialNumber({id: "dealer", fieldName : "code", numberName : "经销商编号"});
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.dealerportal}); //继承

    $scope.dealerportal.list();
});