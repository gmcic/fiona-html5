// 入库管理
angular.module('fiona').controller('InstorageController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        userdicts: {frequencySet: "用药频次", useWaySet: "药品使用方法", useUnitSet: "物品单位"},
        callback : {
            userdicts : function () {
                // 处方单位
                $scope.dropdowns.recipeUnitSet = $scope.dropdowns.useUnitSet;
            }
        }
    };

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

    // 供应商
    $scope.dropdownWithTable({id: "warehouseId", server: "/api/v2/warehouses", value: "id", text: "name"});

    /** 审核 */
    $scope.auditing  = function () {

        $http.get(commons.getBusinessHostname() + $scope.instorageportal.server + "/audit/" + $scope.instorage.id).success(function (data, status, headers, config) {

            $scope.instorages.replaceById(data.data);

            commons.success("审核成功");

            $("#instorage").modal('toggle');
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(instorage.id, "保存失败");
        });

    };

    /**
     * 入库管理
     * ---------------------------
     * */
    $scope.instorageportal= {

        foreignKey : 'inWarehouseCode',

        id: "instorage",

        name: "入库管理",

        server: "/api/v2/warehouseinrecords",

        defilters: {"dealerName": "经销商", "inWarehouseCode": "入库单号", "checkMan": "审核人"},

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
                $scope.instoragedetailportal.search();
            },

            view: function () {
                $scope.instoragedetailportal.search();
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

            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.instoragedetails, function (data, index, array) {
                    console.log(data);
                    $scope.instoragedetail = data;
                    $scope.instoragedetail.inWarehouseCode = $scope.instorage.inWarehouseCode;
                    $scope.instoragedetailportal.save();
                });
            }
        }
    };

    $scope.instorageportal.auditing = function (id) {

        $scope.instorageportal.auditingoperate = true;

        $scope.instorageportal.update(id);
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
                $scope.instorage.totalCount++;
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

            $("#dealerselect").modal('toggle');
        },

        checked: function (dealer) {
            $scope.instorage.dealerCode = dealer.code;
            $scope.instorage.dealerName = dealer.name;

            $("#dealerselect").modal('toggle');
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

            var instoragedetail = $scope.productchecked[_product.itemCode];

            // 是否已选择

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

            // 总数据
            $scope.instorage.totalCount++;

            $scope.instoragedetails.push(instoragedetail);

            commons.modalsuccess("instorage", "成功添加[ " +_product.itemName+ " ]商品");
        }

        $scope.productportal.resize();

        if (!$scope.doctorprescriptdetails) {
            $scope.doctorprescriptdetails = [];
        }
    };

    $scope.productportal.resize = function () {

        $scope.instorage.inWarehouseTotalCost = 0;

        angular.forEach($scope.instoragedetails, function (_instoragedetail) {

            // 小计
            _instoragedetail.inputCost = _instoragedetail.sellPrice * _instoragedetail.inputCount;

            // 总金额
            $scope.instorage.inWarehouseTotalCost += _instoragedetail.inputCost;

        });
    }

    $scope.productportal.list();

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
//        $("#productselect").modal('toggle');
//    };

    // 初始化列表
    $scope.instorageportal.filter();
});