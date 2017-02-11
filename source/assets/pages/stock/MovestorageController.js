
// 移库记录
angular.module('fiona').controller('MovestorageController', function($scope, $http,  $controller, commons) {

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 仓库
    $scope.dropdownWithTable({id: "fromWarehouseId", server: "/api/v2/warehouses", value: "id", text: "name"});

    $scope.dropdownWithTable({id: "toWarehouseId", server: "/api/v2/warehouses", value: "id", text: "name"});

    /**
     * 移库记录
     * ---------------------------
     * */
    $scope.movestorageportal= {

        foreignkey : 'outWarehouseCode',

        id: "movestorage",

        name: "移库记录",

        server: "/api/v2/warehousemoverecords",

        defilters: {"outWarehouseCode": "移库单号", "checkMan": "审核人"},

        onchange: function () {
            angular.forEach($scope.dropdowns.toWarehouseIdSet, function (_warehouse) {

                if($scope.movestorage.fromWarehouseId == _warehouse.id)
                {
                    $scope.movestorage.fromWarehouse= _warehouse.valueNameCn;
                }

                if($scope.movestorage.toWarehouseId == _warehouse.id)
                {
                    $scope.movestorage.toWarehouse = _warehouse.valueNameCn;
                }
            });
        },

        callback: {
            update: function () {
                $scope.movestoragedetailportal.search();
            },

            insert: function () {

                $scope.movestoragedetails = [];

                // 总数据
                $scope.movestorage.totalCount = 0;

                // 总金额
                $scope.movestorage.inWarehouseTotalCost= 0;

                // 生成入库单号
                $scope.serialNumber({id: "movestorage", fieldName : "outWarehouseCode", numberName : "移库编号"});

                $scope.setSelectDefault("movestorage", ["toWarehouseId.id", "fromWarehouseId.id"]);
            },

            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.movestoragedetails, function (_movestoragedetail, index, array) {

                    _movestoragedetail.outWarehouseCode = $scope.movestorage.outWarehouseCode;

                    $scope.movestoragedetailportal.saveWithEntity(_movestoragedetail);
                });
            }
        }
    };

    $scope.movestorageportal.auditing = function (id) {

        $scope.movestorageportal.auditingoperate = true;

        $scope.movestorageportal.update(id);
    };

    /** 出库审核 */
    $scope.auditing  = function () {

        $http.get(commons.getBusinessHostname() + $scope.movestorageportal.server + "/audit/" + $scope.movestorage.id + commons.getTimestampStr()).success(function (data, status, headers, config) {

            $scope.movestorages.replaceById(data.data);

            commons.success("审核成功");

            $("#movestorage").modal('hide');
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(instorage.id, data.message);
        });
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.movestorageportal}); //继承

    /**
     * 移库明细
     * ---------------------------
     * */
    $scope.movestoragedetailportal= {

        foreign: "movestorage", // 外键

        foreignkey: "outWarehouseCode",

        id: "movestoragedetail",

        name: "移库明细",

        server: "/api/v2/warehousemoverecorddetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.movestoragedetailportal}); //继承

    /**
     * 商品&服务弹出选择
     * ---------------------------
     * */

    $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

    $scope.productportal.checked = function (_product) {

        if (!$scope.movestoragedetails) {
            $scope.movestoragedetails = [];
        }

        if($scope.movestoragedetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择

            var movestoragedetail = $scope.movestoragedetails.unique('itemCode', _product.itemCode);

            // 个数
            movestoragedetail.inputCount++;

            commons.modalsuccess("movestorage", "成功添加[ " +_product.itemName+ " ]商品");
        }
        else {
            var movestoragedetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                movestoragedetail[name] = _product[name];
            });

            // 个数
            movestoragedetail.inputCount = 1;

            $scope.movestoragedetails.push(movestoragedetail);

            commons.modalsuccess("movestorage", "成功添加[ " +_product.itemName+ " ]商品");
        }

        $scope.productportal.resize();

        if (!$scope.doctorprescriptdetails) {
            $scope.doctorprescriptdetails = [];
        }
    };

    $scope.productportal.resize = function () {

        $scope.movestorage.totalCount = 0;
        $scope.movestorage.inWarehouseTotalCost = 0;

        angular.forEach($scope.movestoragedetails, function (_movestoragedetail) {

            $scope.movestorage.totalCount += _movestoragedetail.inputCount;

            // 小计
            _movestoragedetail.inputCost = _movestoragedetail.sellPrice * _movestoragedetail.inputCount;

            // 总金额
            $scope.movestorage.inWarehouseTotalCost += _movestoragedetail.inputCost;

        });
    }

    $scope.productportal.autocompletedata();

    // 初始化列表
    $scope.movestorageportal.filter();
});
