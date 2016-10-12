// 出库管理
angular.module('fiona').controller('OutstorageController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "warehousesSet", server: "/api/v2/warehouses", code: "code", text: "name"});

    /**
     * 出库管理
     * ---------------------------
     * */
    $scope.outstorageportal= {

        id: "outstorage",

        name: "出库管理",

        server: "/api/v2/warehouseoutrecords",

        defilters: {"petCode": "宠物昵称", "petName": "宠物昵称", "gestCode": "会员编号", "gestName": "会员名称"},

        callback: {
            insert: function () {
                $scope.outstoragedetailportal.search();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.outstorageportal}); //继承

    /**
     * 出库明细
     * ---------------------------
     * */
    $scope.outstoragedetailportal= {

        foreign: "outstorage", // 外键

        foreignkey: "inWarehouseCode",

        id: "outstoragedetail",

        name: "出库明细",

        server: "/api/v2/warehouseinrecorddetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.outstoragedetailportal}); //继承


    /**
     * 商品&服务弹出选择
     * ---------------------------
     * */
    $controller('ProductPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.producttypeportal.init();

    $scope.productportal.filter();

    $scope.productportal.submit = function () {
        if (!$scope.outstoragedetails) {
            $scope.outstoragedetails = [];
        }

        angular.forEach($scope[$scope.productportal.id + "s"], function (product) {
            if($scope.productportal.selection[product.id])
            {
                var outstoragedetail= {createUserId: 1, updateUserId: 1};

                angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "sellPrice", "packageUnit", "", "", ""], function (name) {
                    outstoragedetail[name] = product[name];
                });

                // 个数
                outstoragedetail.inputCount = 1;
                // 总价
                outstoragedetail.totalCost = 1;

                $scope.outstoragedetails.push(outstoragedetail);
            }
        });

        $('#' + $scope.productportal.id).modal('toggle');
    };
    //
    //
    //
    // // 选择商品
    // $scope.productportal = {
    //     slave: {
    //         text: "cateName",
    //
    //         parent: "parentId",
    //
    //         foreignkey: "cateNo",         // id = {master.foreignkey}
    //
    //         id: "producttype",
    //
    //         name: "化验项目",
    //
    //         server: "/api/v2/itemcates"
    //     },
    //
    //     // 主数据加载地址
    //     master: {
    //         id: "product",
    //
    //         name: "商品&服务",
    //
    //         server: "/api/v2/itemtypes",
    //
    //         submit: function (selected) {
    //             $scope.outstoragedetailss = selected;
    //         }
    //     },
    //
    //     // 综合搜索项
    //     filters : [{"fieldName": "itemCode","operator": "EQ", "value":""} , {"fieldName": "itemName","operator": "EQ", "value":""}],
    //
    //     placeholder : "请输入宠物病例号/宠物昵称/会员编号/会员名称/会员电话"
    //
    // };
    //
    // $controller('TreeSidePortalController', {$scope: $scope, component: $scope.productportal}); //继承
    //
    // $scope.productportal.treeload();
    // $scope.productportal.search();
    //
    // // Packing.treebind($scope.productpack, $http, commons);
    //
    // // 主表编辑时回调
    // $scope.master.update = function () {
    //
    //     $scope.outstoragedetails.search($scope.outstorage.id);
    // };
});