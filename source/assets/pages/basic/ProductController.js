// 商品与服务管理
angular.module('fiona').controller('ProductController', function ($scope, $controller, $http, commons) {

    // 是否打折: isVipDiscount, 是否销售: isSell, 是否记库: isCount
    $scope.dropdowns = {};

    commons.findDict($scope.dropdowns, {recipeUnitSet: "物品单位", packageUnitSet: "物品单位", drugFormSet: "剂型", isVipDiscountSet: "onoff", isSellSet: "onoff", isCountSet: "onoff", isCanExchangeSet: "onoff"});

    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "busiTypeId", server: "/api/v2/businescates", value: "id", text: "cateName"});

    /**
     * 商品管理
     * ---------------------------
     * */
    $controller('ProductPopupCheckedPanelController', {$scope: $scope}); //继承

    /**
     * 供应商
     * ---------------------------
     * */
    $scope.dealerportal= {

        id: "dealer",

        name: "供应商",

        server: "/api/v2/dealers",

        pupupselect: function () {

            $scope.dealerportal.list();

            $("#dealerselect").modal({backdrop: 'static', keyboard: false});
        },

        checked: function (dealer) {
            $scope.product.dealerCode = dealer.code;
            $scope.product.dealerName = dealer.name;

            $("#dealerselect").modal({backdrop: 'static', keyboard: false});
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.dealerportal}); //继承

    $scope.producttypeportal.init();

    $scope.productportal.filter();
});

