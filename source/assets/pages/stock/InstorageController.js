// 入库管理
angular.module('fiona').controller('InstorageController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "warehousesSet", server: "/api/v2/warehouses", code: "id", text: "name"});

    /**
     * 入库管理
     * ---------------------------
     * */
    $scope.instorageportal= {

        id: "instorage",

        name: "入库管理",

        server: "/api/v2/warehouseinrecords",

        defilters: {"petCode": "宠物昵称", "petName": "宠物昵称", "gestCode": "会员编号", "gestName": "会员名称"},

        callback: {
            insert: function () {
                $scope.instoragedetailportal.search();

                // 生成入库单号
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=入库单编号").success(function (data, status, headers, config) {

                    $scope.instorage.inWarehouseCode = data.code;

                }).error(function (data, status, headers, config) { //     错误

                    commons.danger("生成序列号失败");
                });
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.instorageportal}); //继承

    /**
     * 入库明细
     * ---------------------------
     * */
    $scope.instoragedetailportal= {

        foreign: "instorage", // 外键

        foreignkey: "inWarehouseCode",

        id: "instoragedetail",

        name: "入库明细",

        server: "/api/v2/warehouseinrecorddetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.instoragedetailportal}); //继承


    /**
     * 供应商
     * ---------------------------
     * */
    $scope.dealerportal= {

        id: "dealer",

        name: "供应商",

        server: "/api/v2/dealers"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.dealerportal}); //继承

    $scope.dealerportal.list();
    
    /**
     * 商品&服务弹出选择
     * ---------------------------
     * */
    $controller('ProductPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.producttypeportal.init();

    $scope.productportal.filter();

    $scope.productportal.submit = function () {
        if (!$scope.instoragedetails) {
            $scope.instoragedetails = [];
        }

        angular.forEach($scope[$scope.productportal.id + "s"], function (product) {
            if($scope.productportal.selection[product.id])
            {
                var instoragedetail= {createUserId: 1, updateUserId: 1};

                angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCount", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                    instoragedetail[name] = product[name];
                });

                // 个数
                instoragedetail.inputCount = 1;
                // 总价
                instoragedetail.totalCost = 1;

                $scope.instoragedetails.push(instoragedetail);
            }
        });

        $('#' + $scope.productportal.id).modal('toggle');
    };
});