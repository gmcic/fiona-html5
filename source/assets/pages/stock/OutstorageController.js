// 出库管理
angular.module('fiona').controller('OutstorageController', function($scope, $http, $controller, commons) {

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 仓库
    $scope.dropdownWithTable({id: "warehouseId", server: "/api/v2/warehouses", value: "id", text: "name"});

    /**
     * 出库管理
     * ---------------------------
     * */
    $scope.outstorageportal= {

        foreignkey : 'outWarehouseCode',

        id: "outstorage",

        name: "出库管理",

        server: "/api/v2/warehouseoutrecords",

        defilters: {"outWarehouseCode": "出库单号", "checkMan": "审核人"},

        onchange: function () {
            angular.forEach($scope.dropdowns.warehousesSet, function (data) {

                if($scope.outstorage.warehouseId == data.id)
                {
                    $scope.outstorage.outWarehouse = data.valueNameCn;
                }
            });
        },

        callback: {
            update: function () {
                $scope.outstoragedetailportal.search();
            },
            insert: function () {

                $scope.outstoragedetails = [];

                // 总数据
                $scope.outstorage.totalCount = 0;

                // 总金额
                $scope.outstorage.outWarehouseTotalCost= 0;

                // 生成出库单号
                $scope.serialNumber({id: "outstorage", fieldName : "outWarehouseCode", numberName : "出库单号"});

                $scope.setSelectDefault("outstorage", ["warehouseId.id"]);
            },

            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.outstoragedetails, function (_outstoragedetail, index, array) {
                    _outstoragedetail.outWarehouseCode = $scope.outstorage.outWarehouseCode;
                    $scope.outstoragedetailportal.saveWithEntity(_outstoragedetail);
                });
            }
        }
    };

    $scope.outstorageportal.auditing = function (id) {

        $scope.outstorageportal.auditingoperate = true;

        $scope.outstorageportal.update(id);
    };

    /** 出库审核 */
    $scope.auditing  = function () {
        $http.get(commons.getBusinessHostname() + $scope.outstorageportal.server + "/audit/" + $scope.outstorage.id).success(function (data, status, headers, config) {

            $scope.outstorages.replaceById(data.data);

            commons.success("审核成功");

            $("#outstorage").modal('hide');
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(outstorage.id, data.message);
        });
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.outstorageportal}); //继承

    /**
     * 出库明细
     * ---------------------------
     * */
    $scope.outstoragedetailportal= {

        foreign: "outstorage", // 外键

        foreignkey: "outWarehouseCode",

        id: "outstoragedetail",

        name: "出库明细",

        server: "/api/v2/warehouseoutrecorddetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.outstoragedetailportal}); //继承


    /**
     * 弹出选择商品
     * ---------------------------
     * */
    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    $scope.productportal.checked = function (_product) {

        if (!$scope.outstoragedetails) {
            $scope.outstoragedetails = [];
        }

        if($scope.outstoragedetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择

            var outstoragedetail = $scope.outstoragedetails.unique('itemCode', _product.itemCode);

            // 个数
            outstoragedetail.inputCount++;

            commons.modalsuccess("outstorage", "成功添加[ " +_product.itemName+ " ]商品");
        }
        else {
            var outstoragedetail= {};

            angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                outstoragedetail[name] = _product[name];
            });

            // 个数
            outstoragedetail.inputCount = 1;

            $scope.outstoragedetails.push(outstoragedetail);

            commons.modalsuccess("outstorage", "成功添加[ " +_product.itemName+ " ]商品");
        }

        $scope.productportal.resize();

        if (!$scope.doctorprescriptdetails) {
            $scope.doctorprescriptdetails = [];
        }
    };

    $scope.productportal.resize = function () {

        $scope.outstorage.totalCount = 0;

        $scope.outstorage.outWarehouseTotalCost = 0;

        angular.forEach($scope.outstoragedetails, function (_outstoragedetail) {

            $scope.outstorage.totalCount += _outstoragedetail.inputCount;

            // 小计
            _outstoragedetail.inputCost = _outstoragedetail.sellPrice * _outstoragedetail.inputCount;

            // 总金额
            $scope.outstorage.outWarehouseTotalCost += _outstoragedetail.inputCost;
        });
    }

    $scope.productportal.autocompletedata();

    // 初始化列表
    $scope.outstorageportal.filter();
});