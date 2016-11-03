
// 销售退货
angular.module('fiona').controller('ItbackController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = [
        {name: "assistantIdSet", server: "personss"},  // 服务助理ID
        {name: "hairdresserIdSet", server: "personss"} // 服务师ID
    ];

    $scope.dropdowns= {};

    // 主数据加载地址
    $scope.master = {
        id: "itback",

        name: "销售退货",

        server: "/api/v2/services",
        update: function () {
            // $scope.petportal.get($scope.beauty.gestId);
            // $scope.vipportal.search();
        }
    };

    // 综合搜索项
    $scope.filters = [{"code": "name","operator": "EQ", "value":""} , {"name": "name","operator": "EQ", "value":""} , {"contractMan": "name","operator": "EQ", "value":""} , {"mobilePhone": "name","operator": "EQ", "value":""} , {"dealerAddress": "name","operator": "EQ", "value":""}];

    $scope.placeholder = "请输入自动编号 / 经销商名称 / 联系人 / 手机 / 地址";

    $controller('BasePaginationController', {$scope: $scope}); //继承

    /**
     * 选择会员
     * ---------------------------
     * */
    

    $scope.vipportal = {
        dropdowns: {},

        dropboxargs : [
            {name: "gestStyleSet", server: "gestlevels"},
            {name: "statusSet", server: "dicts", filterName: "会员状态"},
            {name: "gestSexSet", server: "userdicts", filterName: "性别"}
        ],

        master: {
            id: "vip",

            name: "会员",

            server: "/api/v2/gests",

            checked: function () {
                // 主人ID
                $scope.itback.gestId = $scope.vip.id;

                // 主人编号
                // $scope.itback.gestCode = $scope.vip.gestCode;

                // 主人名称
                $scope.itback.gestName = $scope.vip.gestName;

                // 主人名称
                $scope.itback.gestPhone = $scope.vip.mobilePhone;
            },

            cancel: function () {
                // 主人ID
                $scope.itback.gestId = $scope.vip.id;

                // 主人编号
                // $scope.itback.gestCode = $scope.vip.gestCode;

                // 主人名称
                $scope.itback.gestName = $scope.vip.gestName;

                // 主人名称
                $scope.itback.gestPhone = $scope.vip.mobilePhone;
            }
        },

        parent: {
            id: "itback"
        }
    };

    $controller('SaleVipController', {$scope: $scope, component: $scope.vipportal}); //继承

    /**
     * 退货商品明细
     * ---------------------------
     * */
    $scope.itbackdetailportal = {
        master: {
            id: "itbackdetail",

            name: "销售退货明细",

            foreignkey: "rcId", // 外键

            server: "/api/v2/returncommoditydetails"
        },

        parent: {
            id: "itback"
        }
    };

    $controller('BasePortalController', {$scope: $scope, component: $scope.itbackdetailportal}); //继承

    /**
     * 弹出选择商品
     * ---------------------------
     * */
    $controller('ProductPopupSelectController', {$scope: $scope}); //继承

    $scope.productportal.master.submit = function (selected) {
        if (!$scope.itbackdetails) {
            $scope.itbackdetails = [];
        }

        angular.forEach(selected, function (_itbackdetail) {
            var itbackdetail = {createUserId: 1, updateUserId: 1};

            // 服务ID
            // itbackdetail.serviceId = $scope.inhospital.id;

            angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "sellPrice", "packageUnit", "", "", ""], function (name) {
                itbackdetail[name] = _itbackdetail[name];
            });

            // 个数
            itbackdetail.inputCount = 1;
            // 总价
            itbackdetail.totalCost = 1;

            $scope.itbackdetails.push(itbackdetail);
            //
            // // 备
            // itbackdetail.remark = _itbackdetail.remark;
        });

        // 总项
        // $scope.inhospital.totalNum = $scope.itbackdetails.length;

        // 总金额
        //
        // $scope.inhospital.totalCost = $scope.itbackdetail.length;
    };

    $scope.productportal.init();
});