// 商品与服务管理
angular.module('fiona').controller('ProductController', function ($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        // dicts: {},

        // 销售单位 , recipeUnitSet: "物品单位"
        userdicts: {packageUnitSet: "物品单位", drugFormSet: "剂型"},
        
        callback: {
            userdicts : function () {
                // 处方单位
                $scope.dropdowns.recipeUnitSet = $scope.dropdowns.packageUnitSet;

                $scope.producttypeportal.init();

                $scope.productportal.filter();
            }
        }
    };

    // 是否打折: isVipDiscount, 是否销售: isSell, 是否记库: isCount
    $scope.dropdowns = {isVipDiscountSet: [{id: "是", valueNameCn: "是"}, {id: "否", valueNameCn: "否"}]};

    $controller('BaseController', {$scope: $scope}); //继承

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

            $("#dealerselect").modal('toggle');
        },

        checked: function (dealer) {
            $scope.product.dealerCode = dealer.code;
            $scope.product.dealerName = dealer.name;

            $("#dealerselect").modal('toggle');
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.dealerportal}); //继承


    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

    $scope.dropdowns.isSellSet = $scope.dropdowns.isVipDiscountSet;
    $scope.dropdowns.isCountSet = $scope.dropdowns.isVipDiscountSet;
    $scope.dropdowns.isCanExchangeSet = $scope.dropdowns.isVipDiscountSet;

    $scope.dropdownWithTable({id: "busiTypeId", server: "/api/v2/businescates", value: "id", text: "cateName"});
});

