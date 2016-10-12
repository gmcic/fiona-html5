// 销售查询
angular.module('fiona').controller('SaleplatedetailController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {types: [{code: "1", name: "经销商"}, {code: "2", name: "生产商"}, {code: "3", name: "经销商和生产商"}]};

    $scope.saleplate = {directSellCode:"单号0019192838473", totalNum: 0, totalCost: 0};

    $scope.saleplatedetail = {};

    // 主数据加载地址
    $scope.master = {
        id: "saleplatedetail",

        name: "直接销售",

        server: "/api/v2/storedirectselldetails"
    };

    // 综合搜索项
    $scope.filters = [
        // 宠物昵称
        {"fieldName": "petCode","operator": "EQ", "value":""},

        // 宠物昵称
        {"fieldName": "petName","operator": "EQ", "value":""},

        // 会员编号
        {"fieldName": "gestCode","operator": "EQ", "value":""},

        // 会员名称
        {"fieldName": "gestName","operator": "EQ", "value":""}
    ];

    $scope.placeholder = "请输入宠物病例号/宠物昵称/会员编号/会员名称/会员电话";

    $controller('BasePaginationController', {$scope: $scope}); //继承

    /**
     * 添加商品
     * ---------------------------
     * */
    $scope.settlement = function () {
        alert("结算: ");
    };

    $scope.addProcut = function (product) {

        console.log(product);

        if(!$scope["saleplatedetails"])
        {
            $scope["saleplatedetails"] = [];
        }

        var saleplatedetail;

        $scope.saleplate.totalCost = 0;

        $scope.saleplate.totalNum = 0;

        angular.forEach($scope["saleplatedetails"], function (node) {

            if(product.itemCode == node.itemCode)
            {
                saleplatedetail = node;
                node.itemNum += 1;
            }
            else {
                $scope.saleplate.totalNum += node.itemNum;
                $scope.saleplate.totalCost += node.totalCost
            }
        });

        if(!saleplatedetail)
        {
            saleplatedetail = $scope.clone(product);

            $scope["saleplatedetails"].push(saleplatedetail);
        }

        // 计算小计
        saleplatedetail.totalCost = saleplatedetail.itemNum * saleplatedetail.sellPrice;

        $scope.saleplate.totalNum += saleplatedetail.itemNum;
        $scope.saleplate.totalCost += saleplatedetail.totalCost

    };

    $scope.clone = function (obj) {

        var clone = {};

        angular.forEach(["itemCode", "itemName", "barCode", "sellPrice",  "itemStandard", "manufacturerCode", "manufacturerName", "sellContent", "isBulk", "paidStatus", "paidTime", "warehouseId"], function (name) {
            clone[name] = obj[name];
        });

        // 单位
        clone.sellUnit = obj.itemBulk;

        clone.manufacturerCode = obj.dealerCode;
        clone.manufacturerName = obj.dealerName;

        clone.itemNum = 1;

        return clone;
    };

    /**
     * 目录树（商品与服务）
     * ---------------------------
     * */
    $scope.producttypepanel = {

        text: "cateName", // 树标签-字段名

        parent: "parentId", // 父引用-字段名

        foreignkey: "cateNo", //

        id: "producttype",

        name: "化验项目",

        server: "/api/v2/itemcates",

        selectNode: function () {
            $('#tabtag a[href="//#part_list"]').tab('show') // Select tab by

            // 加载
            $scope.productpanel.search();
        }
    };

    $controller('TreePanelController', {$scope: $scope, component: $scope.producttypepanel}); //继承

    // 初始化
    $scope.producttypepanel.init();

    /**
     * 加载商品
     * ---------------------------
     * */

    $scope.productpanel = {

        foreign: "producttype", // 外键

        foreignkey: "cateNo",

        id: "product",

        name: "商品&服务",

        server: "/api/v2/itemtypes"
    };

    $controller('TablePaginationPanelController', {$scope: $scope, component: $scope.productpanel}); //继承


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
                $scope.saleplate.gestId = $scope.vip.id;

                // 主人编号
                $scope.saleplate.gestCode = $scope.vip.gestCode;

                // 主人名称
                $scope.saleplate.gestName = $scope.vip.gestName;

                // 主人名称
                $scope.saleplate.gestPhone = $scope.vip.mobilePhone;
            },

            cancel: function () {
                // 主人ID
                $scope.saleplate.gestId = $scope.vip.id;

                // 主人编号
                $scope.saleplate.gestCode = $scope.vip.gestCode;

                // 主人名称
                $scope.saleplate.gestName = $scope.vip.gestName;

                // 主人名称
                $scope.saleplate.gestPhone = $scope.vip.mobilePhone;
            }
        },

        parent: {
            id: "saleplatedetail"
        }
    };

    $controller('SaleVipController', {$scope: $scope, component: $scope.vipportal}); //继承


});
