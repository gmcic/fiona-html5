
// 移库记录
angular.module('fiona').controller('MovestorageController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "warehousesSet", server: "/api/v2/warehouses", code: "code", text: "name"});

    /**
     * 移库记录
     * ---------------------------
     * */
    $scope.movestorageportal= {

        id: "movestorage",

        name: "移库记录",

        server: "/api/v2/warehousemoverecords",

        defilters: {"petCode": "宠物昵称", "petName": "宠物昵称", "gestCode": "会员编号", "gestName": "会员名称"},

        callback: {
            insert: function () {
                $scope.movestoragedetailportal.search();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.movestorageportal}); //继承

    /**
     * 移库明细
     * ---------------------------
     * */
    $scope.movestoragedetailportal= {

        foreign: "movestorage", // 外键

        foreignkey: "inWarehouseCode",

        id: "movestoragedetail",

        name: "移库明细",

        server: "/api/v2/warehouseinrecorddetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.movestoragedetailportal}); //继承

    /**
     * 商品&服务弹出选择
     * ---------------------------
     * */
    $controller('ProductPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.producttypeportal.init();

    $scope.productportal.filter();

    $scope.productportal.submit = function () {
        if (!$scope.movestoragedetails) {
            $scope.movestoragedetails = [];
        }

        angular.forEach($scope[$scope.productportal.id + "s"], function (product) {
            if($scope.productportal.selection[product.id])
            {
                var movestoragedetail= {createUserId: 1, updateUserId: 1};

                angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "sellPrice", "packageUnit", "", "", ""], function (name) {
                    movestoragedetail[name] = product[name];
                });

                // 个数
                movestoragedetail.inputCount = 1;
                // 总价
                movestoragedetail.totalCost = 1;

                $scope.movestoragedetails.push(movestoragedetail);
            }
        });

        $('#' + $scope.productportal.id).modal('toggle');
    };

});
