// 入库管理
angular.module('fiona').controller('InstorageController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    $scope.dropdownWithTable({id: "warehouses", server: "/api/v2/warehouses", value: "id", text: "name"});

    $scope.auditing  = function () {
        $http.get(commons.getBusinessHostname() + $scope.instorageportal.server + "/audit/" + $scope.instorage.id).success(function (data, status, headers, config) {
            commons.modalsuccess(instorage.id, "审核成功");
        }).error(function (data, status, headers, config) { //     错误
            commons.modaldanger(instorage.id, "保存失败");
        });
    };

    /**
     * 入库管理
     * ---------------------------
     * */
    $scope.instorageportal= {

        foreignKey : 'backWarehouseCode',

        id: "instorage",

        name: "入库管理",

        server: "/api/v2/warehouseinrecords",

        defilters: {"petCode": "宠物昵称", "petName": "宠物昵称", "gestCode": "会员编号", "gestName": "会员名称"},

        onchange: function () {
            angular.forEach($scope.dropdowns.warehousesSet, function (data) {

                if($scope.instorage.toWarehouseCode == data.id)
                {
                    $scope.instorage.toWarehouseName = data.valueNameCn;
                }
            });
        },

        resize: function () {

            $scope.instorage.inWarehouseTotalCost = 0;

            angular.forEach($scope.instoragedetails, function (data) {

                // 小计
                data.inputCost = data.sellPrice * data.inputCount;

                // 总金额
                $scope.instorage.inWarehouseTotalCost += data.inputCost;

            });
        },

        callback: {
            update: function () {
                $scope.instoragedetailportal.search();
            },

            insert: function () {
                $scope.instoragedetails = [];

                // 总数据
                $scope.instorage.totalCount = 0;

                // 总金额
                $scope.instorage.inWarehouseTotalCost= 0;

                // 生成入库单号
                $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=入库单号").success(function (data, status, headers, config) {

                    $scope.instorage.inWarehouseCode = data.data;

                }).error(function (data, status, headers, config) { //     错误

                });
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

        server: "/api/v2/dealers",

        callback: {
            update: function () {
                $scope.instorage.dealerCode = $scope.dealer.code;
                $scope.instorage.dealerName = $scope.dealer.name;

            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.dealerportal}); //继承

    $scope.dealerportal.list();
    
    /**
     * 商品&服务弹出选择
     * ---------------------------
     * */

    $scope.productchecked = {};

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
                if($scope.productchecked[product.itemCode]) {

                    var instoragedetail = $scope.productchecked[product.itemCode];

                    // 是否已选择

                    // 个数
                    instoragedetail.inputCount++;

                    $scope.instorageportal.resize();
                }
                else {
                    // 未选择新添加

                    var instoragedetail= {createUserId: 1, updateUserId: 1};

                    //  "inputCount",

                    angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "packageUnit", "itemBulk", "inputPrice", "drugForm", "itemStyle", "sellPrice", "inputCost", "produceDate", "inputDate", "outDateTime", "safeDay", "wareUpLimit", "wareDownLimit", "remark", "batchNumber", "manufacturerCode", "manufacturerName"], function (name) {
                        instoragedetail[name] = product[name];
                    });


                    // 个数
                    instoragedetail.inputCount = 1;

                    // 总数据
                    $scope.instorage.totalCount++;

                    $scope.productchecked[instoragedetail.itemCode] = instoragedetail;

                    $scope.instoragedetails.push(instoragedetail);

                    $scope.instorageportal.resize();
                }
            }
        });

        $('#' + $scope.productportal.id).modal('toggle');
    };

    // 初始化列表
    $scope.instorageportal.filter();
});