// 入库管理
angular.module('fiona').controller('InstorageController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= {};

    commons.findDict($scope.dropdowns, {frequencySet: "用药频次", useWaySet: "药品使用方法", useUnitSet: "物品单位", recipeUnitSet: "物品单位"});

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 仓库
    $scope.dropdownWithTable({id: "warehouseId", server: "/api/v2/warehouses", value: "id", text: "name"});

    /**
     * 入库管理
     * ---------------------------
     * */
    $scope.instorageportal= {

        foreignkey : 'inWarehouseCode',

        id: "instorage",

        name: "入库管理",

        server: "/api/v2/warehouseinrecords",

        defilters: {"remark": "备注"},

        onchange: function () {
            angular.forEach($scope.dropdowns.warehousesSet, function (data) {
                if($scope.instorage.warehouseId == data.id)
                {
                    $scope.instorage.inWarehouse = data.valueNameCn;
                }
            });
        },

        callback: {
            update: function () {
                $scope.instoragedetailportal.searchAll();
            },

            view: function () {
                $scope.instoragedetailportal.searchAll();
            },

            insert: function () {
                $scope.instoragedetails = [];

                // 总数据
                $scope.instorage.totalCount = 0;

                // 总金额
                $scope.instorage.inWarehouseTotalCost= 0;

                // 生成入库单号
                $scope.serialNumber({id: "instorage", fieldName : "inWarehouseCode", numberName : "入库单号"});

                $scope.setSelectDefault("instorage", ["warehouseId.id"]);
            },
            submitbefore: function () {
              if($scope.instorage.warehouseId)
              {
                $scope.instorage.inWarehouse = $scope.dropdowns.warehouseIdSet.getObjectWithId({id: $scope.instorage.warehouseId}).valueNameCn;
              }
            },
            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.instoragedetails, function (_instoragedetail) {
                      // 入库单号
                      _instoragedetail.inWarehouseCode = $scope.instorage.inWarehouseCode;

                    $scope.instoragedetailportal.saveWithEntity(_instoragedetail);
                });
            }
        }
    };

    $scope.instorageportal.auditing = function (id) {

        $scope.instorageportal.auditingoperate = true;

        $scope.instorageportal.update(id);
    };

    /** 入库审核 */
    $scope.auditing  = function () {

        $http.get(commons.getBusinessHostname() + $scope.instorageportal.server + "/audit/" + $scope.instorage.id + commons.getTimestampStr()).success(function (data, status, headers, config) {

            $scope.instorages.replaceById(data.data);

            commons.success("审核成功");

            $("#instorage").modal('hide');
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(instorage.id, "保存失败");
        });
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

        server: "/api/v2/warehouseinrecorddetails",

        callback: {
            delete: function () {
                // 总数据
                $scope.instorage.totalCount--;
                $scope.instorage.resize();
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.instoragedetailportal}); //继承

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

            $("#dealerselect").modal('hide');
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

        if (!$scope.instoragedetails) {
            $scope.instoragedetails = [];
        }

        if($scope.instoragedetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择

            var instoragedetail = $scope.instoragedetails.unique('itemCode', _product.itemCode);

            // 个数
            instoragedetail.inputCount++;

            commons.modalsuccess("instorage", "成功添加[ " +_product.itemName+ " ]商品");
        }
        else {
            var instoragedetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                instoragedetail[name] = _product[name];
            });

            // 个数
            instoragedetail.inputCount = 1;

            $scope.instoragedetails.push(instoragedetail);

            commons.modalsuccess("instorage", "成功添加[ " +_product.itemName+ " ]商品");
        }

        $scope.productportal.resize();

        if (!$scope.doctorprescriptdetails) {
            $scope.doctorprescriptdetails = [];
        }
    };

    $scope.productportal.resize = function () {

        $scope.instorage.totalCount = 0;
        $scope.instorage.inWarehouseTotalCost = 0;

        angular.forEach($scope.instoragedetails, function (_instoragedetail) {

            $scope.instorage.totalCount += _instoragedetail.inputCount;

            // 小计
            _instoragedetail.inputCost = _instoragedetail.sellPrice * _instoragedetail.inputCount;

            // 总金额
            $scope.instorage.inWarehouseTotalCost += _instoragedetail.inputCost;

        });
    }

    $scope.productportal.autocompletedata();

//    $scope.productportal.submit = function () {
//
//        if (!$scope.instoragedetails) {
//            $scope.instoragedetails = [];
//        }
//
//        angular.forEach($scope[$scope.productportal.id + "s"], function (_product) {
//            if($scope.productportal.selection[_product.id])
//            {
//                $scope.productportal.checked(_product);
//            }
//        });
//
//        $("#productselect").modal({backdrop: 'static', keyboard: false});
//    };

    // 初始化列表
    $scope.instorageportal.filter();
});