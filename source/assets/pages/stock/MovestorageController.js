
// 移库记录
angular.module('fiona').controller('MovestorageController', function($scope, $http,  $controller, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "warehouses", server: "/api/v2/warehouses", value: "id", text: "name"});

    /**
     * 移库记录
     * ---------------------------
     * */
    $scope.movestorageportal= {

        foreignKey : 'outWarehouseCode',

        id: "movestorage",

        name: "移库记录",

        server: "/api/v2/warehousemoverecords",

        defilters: {"petCode": "宠物昵称", "petName": "宠物昵称", "gestCode": "会员编号", "gestName": "会员名称"},

        onchange: function () {
            angular.forEach($scope.dropdowns.warehousesSet, function (data) {

                if($scope.movestorage.fromWarehouseId == data.id)
                {
                    $scope.movestorage.fromWarehouse= data.valueNameCn;
                }

                if($scope.movestorage.toWarehouseId == data.id)
                {
                    $scope.movestorage.toWarehouse = data.valueNameCn;
                }
            });
        },

        resize: function () {

            $scope.movestorage.inWarehouseTotalCost = 0;

            angular.forEach($scope.movestoragedetails, function (data) {

                // 小计
                data.inputCost = data.sellPrice * data.inputCount;

                // 总金额
                $scope.movestorage.inWarehouseTotalCost += data.inputCost;

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
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=移库编号").success(function (data, status, headers, config) {

                    $scope.movestorage.outWarehouseCode = data.data;

                }).error(function (data, status, headers, config) { //     错误

                    commons.modaldanger("movestorage", "生成入库单号失败");
                });
            },

            submit : function () {

                // 遍历保存所有子项
                angular.forEach($scope.movestoragedetails, function (data, index, array) {
                    console.log(data);
                    $scope.movestoragedetail = data;
                    $scope.movestoragedetail.outWarehouseCode = $scope.movestorage.outWarehouseCode;
                    $scope.movestoragedetailportal.save();
                });
            }
        }
    };

    $scope.movestorageportal.auditing = function (id) {

        $scope.movestorageportal.auditingoperate = true;

        $scope.movestorageportal.update(id);
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

    $scope.productchecked = {};

    $controller('ProductPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.producttypeportal.init();

    $scope.productportal.filter();

    $scope.productportal.submit = function () {
        if (!$scope.movestoragedetails) {
            $scope.movestoragedetails = [];
        }

        angular.forEach($scope[$scope.productportal.id + "s"], function (product) {
            if($scope.productportal.selection[product.id])
            {
                if($scope.productchecked[product.itemCode]) {

                    var movestoragedetail = $scope.productchecked[product.itemCode];

                    // 个数
                    movestoragedetail.inputCount++;

                    $scope.movestorageportal.resize();

                }
                else {
                    // 未选择新添加

                    var movestoragedetail= {createUserId: 1, updateUserId: 1};

                    //  "inputCount",

                    angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                        movestoragedetail[name] = product[name];
                    });

                    // 个数
                    movestoragedetail.inputCount = 1;

                    // 总数据
                    $scope.instorage.totalCount++;

                    $scope.productchecked[movestoragedetail.itemCode] = movestoragedetail;

                    $scope.movestoragedetails.push(movestoragedetail);

                    $scope.movestorageportal.resize();
                }
            }
        });


        $('#' + $scope.productportal.id).modal('toggle');
    };

    // 初始化列表
    $scope.movestorageportal.filter();
});
