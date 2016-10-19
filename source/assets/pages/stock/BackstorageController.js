// 退回记录
angular.module('fiona').controller('BackstorageController', function($scope, $controller, $http, commons, $timeout) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "warehouses", server: "/api/v2/warehouses", value: "id", text: "name"});

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
            angular.forEach($scope.dropdowns.warehousesSet, function (data) {

                if($scope.backstorage.toWarehouseCode == data.id)
                {
                    $scope.backstorage.toWarehouseName = data.valueNameCn;
                }
            });
        },

        resize: function () {

            $scope.backstorage.totalCount = 0;
            $scope.backstorage.backWarehouseTotalCost = 0;

            angular.forEach($scope.backstoragedetails, function (data) {

                // 小计
                data.inputCost = data.sellPrice * data.inputCount;

                // 总数据
                $scope.backstorage.totalCount += data.inputCount;

                // 总金额
                $scope.backstorage.backWarehouseTotalCost += data.inputCost;

            });
        },

        callback: {
            update: function () {
                $scope.backstoragedetailportal.search();
            },
            insert: function () {
                // 总数据
                $scope.backstorage.totalCount = 0;

                // 总金额
                $scope.backstorage.backWarehouseTotalCost= 0;

                // 生成入库单号
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=退货单号").success(function (data, status, headers, config) {

                    $scope.backstorage.backWarehouseCode = data.data;

                }).error(function (data, status, headers, config) { //     错误

                    commons.danger("生成入库单号失败");
                });
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
     * 商品&服务弹出选择
     * ---------------------------
     * */

    $scope.productchecked = {};

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
                if($scope.productchecked[product.itemCode]) {

                    var backstoragedetail = $scope.productchecked[product.itemCode];

                    // 个数
                    backstoragedetail.inputCount++;

                    $scope.backstorageportal.resize();
                }
                else {
                    // 未选择新添加
                    var backstoragedetail= {};

                    angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                        backstoragedetail[name] = product[name];
                    });

                    // 个数
                    backstoragedetail.inputCount = 1;

                    backstoragedetail.totalCount = 0;

                    $scope.productchecked[backstoragedetail.itemCode] = backstoragedetail;

                    $scope.backstoragedetails.push(backstoragedetail);

                    $scope.backstorageportal.resize();
                }
            }
        });

        $('#' + $scope.productportal.id).modal('toggle');
    };

    // 初始化列表
    $scope.backstorageportal.filter();
});
