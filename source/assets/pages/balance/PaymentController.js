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

        server: "/api/v2/gestpaidrecords/billList",

        defilters: { "personCode": "员工编号", "personName": "员工名称 "},

        callback: {
            insert: function(){
                $scope.vipportal.unique("402880ea57d805550157d865ea7e0004");
            },
            update: function(){
                $scope.vipportal.unique("402880ea57d805550157d865ea7e0004");
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.paymentportal}); //继承

    /**
     * 收费明细
     * ---------------------------
     * */
    $scope.paymentdetailportal = {

        id: "paymentdetail",

        name: "收费管理",

        server: "/gestpaidrecords/billDetail",

        defilters: { "personCode": "员工编号", "personName": "员工名称 "},

        callback: {}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.paymentdetailportal}); //继承

    /**
     * 会员管理
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.paymentportal.list();
});
