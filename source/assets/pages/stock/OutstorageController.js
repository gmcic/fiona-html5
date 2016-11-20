// 出库管理
angular.module('fiona').controller('OutstorageController', function($scope, $http, $controller, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "warehouses", server: "/api/v2/warehouses", value: "id", text: "name"});

    /**
     * 出库管理
     * ---------------------------
     * */
    $scope.outstorageportal= {

        foreignKey : 'outWarehouseCode',

        id: "outstorage",

        name: "出库管理",

        server: "/api/v2/warehouseoutrecords",

        defilters: {"petCode": "宠物昵称", "petName": "宠物昵称", "gestCode": "会员编号", "gestName": "会员名称"},

        onchange: function () {
            angular.forEach($scope.dropdowns.warehousesSet, function (data) {

                if($scope.outstorage.warehouseId == data.id)
                {
                    $scope.outstorage.outWarehouse = data.valueNameCn;
                }
            });
        },

        resize: function () {

            $scope.outstorage.outWarehouseTotalCost = 0;

            angular.forEach($scope.outstoragedetails, function (data) {
                // 小计
                data.inputCost = data.sellPrice * data.inputCount;

                // 总金额
                $scope.outstorage.outWarehouseTotalCost += data.inputCost;

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

                // 生成入库单号
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=出库单号").success(function (data, status, headers, config) {

                    $scope.outstorage.outWarehouseCode= data.data;

                }).error(function (data, status, headers, config) { //     错误

                    commons.modaldanger("outstorage", "生成出库单号失败");
                });
            },
            submit : function () {
                // 遍历保存所有子项
                angular.forEach($scope.outstoragedetails, function (data, index, array) {
                    $scope.outstoragedetail = data;
                    $scope.outstoragedetail.outWarehouseCode = $scope.outstorage.outWarehouseCode;
                    $scope.outstoragedetailportal.save();
                });
            }
        }
    };

    $scope.outstorageportal.auditing = function (id) {

        $scope.outstorageportal.auditingoperate = true;

        $scope.outstorageportal.update(id);
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

        if($scope.outstoragedetails.existprop('itemCode', _productitemCode)) {   // 是否已选择

            var outstoragedetail = $scope.productchecked[_productitemCode];

            // 个数
            outstoragedetail.inputCount++;

            $scope.outstoragedetail.resize();

            commons.modalsuccess("instorage", "成功添加[ " +_product.itemName+ " ]商品");
        }
        else {
            var outstoragedetail= {};

            //  "inputCount",

            angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                outstoragedetail[name] = product[name];
            });

            // 个数
            outstoragedetail.inputCount = 1;

            // 总数据
            $scope.instorage.totalCount++;

            $scope.productchecked[outstoragedetail.itemCode] = outstoragedetail;

            $scope.outstoragedetails.push(outstoragedetail);

            $scope.movestorageportal.resize();

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

    $scope.productportal.autocompletedata();


    // 初始化列表
    $scope.outstorageportal.filter();
});