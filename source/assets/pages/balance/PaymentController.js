// 收费管理
angular.module('fiona').controller('PaymentController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = { };

    $scope.dropdowns = {
        typesSet: [{id: "1", valueNameCn: "经销商"}, {id: "2", valueNameCn: "生产商"}, {id: "3", valueNameCn: "经销商和生产商"}]
    };

    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropboxinit($scope.dropboxargs);

    /**
     * 收费管理
     * ---------------------------
     * */
    $scope.paymentportal = {

        id: "payment",

        name: "收费管理",

        server: "/api/v2/personss",

        defilters: { "personCode": "员工编号", "personName": "员工名称 "},

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.paymentportal}); //继承
});
