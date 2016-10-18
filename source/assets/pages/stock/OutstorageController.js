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

            $scope.outstorage.totalCount = 0;
            $scope.outstorage.outWarehouseTotalCost = 0;

            angular.forEach($scope.outstoragedetails, function (data) {

                // 小计
                data.inputCost = data.sellPrice * data.inputCount;

                // 总数据
                $scope.outstorage.totalCount += data.inputCount;

                // 总金额
                $scope.outstorage.outWarehouseTotalCost += data.inputCost;

            });
        },

        callback: {
            update: function () {
                $scope.outstoragedetailportal.search();
            },
            insert: function () {
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
     * 商品&服务弹出选择
     * ---------------------------
     * */

    $scope.productchecked = {};

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
                if($scope.productchecked[product.itemCode]) {

                    var outstoragedetail = $scope.productchecked[product.itemCode];

                    // 个数
                    outstoragedetail.inputCount++;

                    $scope.outstoragedetail.resize();
                }
                else {
                    // 未选择新添加

                    var outstoragedetail= {createUserId: 1, updateUserId: 1};

                    //  "inputCount",

                    angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                        outstoragedetail[name] = product[name];
                    });

                    // 个数
                    outstoragedetail.inputCount = 1;

                    outstoragedetail.totalCount = 0;

                    $scope.productchecked[outstoragedetail.itemCode] = outstoragedetail;

                    $scope.outstoragedetails.push(outstoragedetail);

                    $scope.movestorageportal.resize();
                }
            }
        });

        $('#' + $scope.productportal.id).modal('toggle');
    };


    // 初始化列表
    $scope.outstorageportal.filter();
});