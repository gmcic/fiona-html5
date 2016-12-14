// 退回记录
angular.module('fiona').controller('BackstorageController', function($scope, $controller, $http, commons, $timeout) {

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 仓库
    $scope.dropdownWithTable({id: "warehouseId", server: "/api/v2/warehouses", value: "id", text: "name"});

    /**
     * 退回记录
     * ---------------------------
     * */
    $scope.backstorageportal= {

        foreignKey : 'inWarehouseCode',

        id: "backstorage",

        name: "退回记录",

        server: "/api/v2/warehousebackrecords",

        defilters: {"petCode": "宠物昵称", "petName": "宠物昵称", "gestCode": "会员编号", "gestName": "会员名称"},

        onchange: function () {
            angular.forEach($scope.dropdowns.warehousesSet, function (_warehouse) {

                if($scope.backstorage.toWarehouseCode == _warehouse.id)
                {
                    $scope.backstorage.toWarehouseName = _warehouse.valueNameCn;
                }
            });
        },

        callback: {
            update: function () {
                $scope.backstoragedetailportal.search();
            },
            insert: function () {

                $scope.backstoragedetails = [];

                // 总数据
                $scope.backstorage.totalCount = 0;

                // 总金额
                $scope.backstorage.backWarehouseTotalCost = 0;

                // 生成入库单号
                $scope.serialNumber({id: "backstorage", fieldName : "backWarehouseCode", numberName : "退货单号"});

                $scope.setSelectDefault("backstorage", ["warehouseId.id"]);
            },

            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.backstoragedetails, function (data, index, array) {
                    console.log(data);
                    $scope.backstoragedetail = data;
                    $scope.backstoragedetail.backWarehouseCode = $scope.backstorage.backWarehouseCode;
                    $scope.backstoragedetailportal.save();
                });
            }

        }
    };

    $scope.backstorageportal.auditing = function (id) {

        $scope.backstorageportal.auditingoperate = true;

        $scope.backstorageportal.update(id);
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

        server: "/api/v2/warehousebackrecorddetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.backstoragedetailportal}); //继承


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
            $scope.instorage.dealerCode = dealer.code;
            $scope.instorage.dealerName = dealer.name;

            $("#dealerselect").modal({backdrop: 'static', keyboard: false});
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.dealerportal}); //继承

    $scope.dealerportal.list();

    /**
     * 弹出选择商品
     * ---------------------------
     * */
    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    $scope.productportal.checked = function (_product) {

        if (!$scope.backstoragedetails) {
            $scope.backstoragedetails = [];
        }

        if($scope.backstoragedetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择

            var backstoragedetail = $scope.backstoragedetails.unique('itemCode', _product.itemCode);

            // 个数
            backstoragedetail.inputCount++;

            commons.modalsuccess("instorage", "成功添加[ " +_product.itemName+ " ]商品");
        }
        else {
            var backstoragedetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                backstoragedetail[name] = _product[name];
            });

            // 个数
            backstoragedetail.inputCount = 1;

            $scope.backstoragedetails.push(backstoragedetail);

            commons.modalsuccess("instorage", "成功添加[ " +_product.itemName+ " ]商品");
        }

        $scope.productportal.resize();

        if (!$scope.doctorprescriptdetails) {
            $scope.doctorprescriptdetails = [];
        }
    };

    $scope.productportal.resize = function () {

        $scope.backstorage.totalCount = 0;
        $scope.backstorage.backWarehouseTotalCost = 0;

        angular.forEach($scope.backstoragedetails, function (_backstoragedetail) {

            $scope.backstorage.totalCount += _backstoragedetail.inputCount;

            // 小计
            _backstoragedetail.inputCost = _backstoragedetail.sellPrice * _backstoragedetail.inputCount;

            // 总金额
            $scope.backstorage.backWarehouseTotalCost += _backstoragedetail.inputCost;
        });
    }

    $scope.productportal.autocompletedata();

    // 初始化列表
    $scope.backstorageportal.filter();
});
