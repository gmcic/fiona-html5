// 退回记录
angular.module('fiona').controller('BackstorageController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "warehousesSet", server: "/api/v2/warehouses", code: "code", text: "name"});

    /**
     * 退回记录
     * ---------------------------
     * */
    $scope.backstorageportal= {

        id: "backstorage",

        name: "退回记录",

        server: "/api/v2/warehousebackrecords",

        defilters: {"petCode": "宠物昵称", "petName": "宠物昵称", "gestCode": "会员编号", "gestName": "会员名称"},

        callback: {
            insert: function () {
                $scope.backstoragedetailportal.search();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.backstorageportal}); //继承

    /**
     * 移库明细
     * ---------------------------
     * */
    $scope.backstoragedetailportal= {

        foreign: "backstorage", // 外键

        foreignkey: "inWarehouseCode",

        id: "backstoragedetail",

        name: "移库明细",

        server: "/api/v2/warehouseinrecorddetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.backstoragedetailportal}); //继承


    /**
     * 商品&服务弹出选择
     * ---------------------------
     * */
    $controller('ProductPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.producttypeportal.init();

    $scope.productportal.filter();

    $scope.productportal.submit = function () {
        if (!$scope.backstoragedetails) {
            $scope.backstoragedetails = [];
        }

        angular.forEach($scope[$scope.productportal.id + "s"], function (product) {
            if($scope.productportal.selection[product.id])
            {
                var backstoragedetail= {createUserId: 1, updateUserId: 1};

                angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "sellPrice", "packageUnit", "", "", ""], function (name) {
                    backstoragedetail[name] = product[name];
                });

                // 个数
                backstoragedetail.inputCount = 1;
                // 总价
                backstoragedetail.totalCost = 1;

                $scope.backstoragedetails.push(backstoragedetail);
            }
        });

        $('#' + $scope.productportal.id).modal('toggle');
    };
});
