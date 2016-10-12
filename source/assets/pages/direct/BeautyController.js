// 美容服务
angular.module('fiona').controller('BeautyController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = [
        {name: "assistantIdSet", server: "personss"},  // 服务助理ID
        {name: "hairdresserIdSet", server: "personss"} // 服务师ID
    ];

    $scope.dropdowns= {};


    /**
     * 主数据加载地址
     * ---------------------------
     * */
    $scope.master = {
        id: "beauty",

        name: "美容服务",

        server: "/api/v2/services",
        update: function () {
            $scope.petportal.get($scope.beauty.gestId);
            // $scope.vipportal.search();
        }
    };

    // 综合搜索项
    $scope.filters = [{"code": "name","operator": "EQ", "value":""} , {"name": "name","operator": "EQ", "value":""} , {"contractMan": "name","operator": "EQ", "value":""} , {"mobilePhone": "name","operator": "EQ", "value":""} , {"dealerAddress": "name","operator": "EQ", "value":""}];

    $scope.placeholder = "请输入自动编号 / 经销商名称 / 联系人 / 手机 / 地址";

    $controller('BasePaginationController', {$scope: $scope}); //继承

    /**
     * 服务项目
     * ---------------------------
     * */
    $scope.beautydetailportal = {
        master: {
            id: "beautydetail",

            name: "服务项目",

            foreignkey: "serviceId", // 外键

            server: "/api/v2/servicedetails"
        },

        parent: {
            id: "beauty"
        }
    };

    // 声明要使用的下拉选项
    $scope.loadUserdicts(["医疗类型", "化验单位"]);

    $controller('BasePortalController', {$scope: $scope, component: $scope.beautydetailportal}); //继承

    /**
     *  选择宠物
     * ---------------------------
     * */
    $scope.petportal = {
        dropdowns: {},

        dropboxargs : [
            {name: "gestStyleSet", server: "gestlevels"},
            {name: "statusSet", server: "dicts", filterName: "会员状态"},
            {name: "gestSexSet", server: "userdicts", filterName: "性别"}
        ],

        master: {
            id: "pet",

            name: "宠物",

            server: "/api/v2/pets",

            checked: function () {
                // 主人ID
                $scope.beauty.gestId = $scope.pet.id;

                // 主人编号
                $scope.beauty.gestCode = $scope.pet.gestCode;

                // 主人名称
                $scope.beauty.gestName = $scope.pet.gestName;
            },
            submit: function () {
                // 主人ID
                $scope.beauty.gestId = $scope.pet.id;

                // 主人编号
                $scope.beauty.gestCode = $scope.pet.gestCode;

                // 主人名称
                $scope.beauty.gestName = $scope.pet.gestName;
            },
            insert: function () {
                angular.forEach($scope.petportal.dropdowns, function (value, key) {
                    $scope.pet[key.substr(0, key.length - 3)] = value[0];
                });
            }
        },

        parent: {
            id: "beauty"
        }
    };

    $controller('CommonVipController', {$scope: $scope, component: $scope.petportal}); //继承

    /**
     * 选择商品
     * ---------------------------
     * */
    $scope.productportal = {
        slave: {
            text: "cateName",

            parent: "parentId",

            foreignkey: "cateNo",         // id = {master.foreignkey}

            id: "producttype",

            name: "化验项目",

            server: "/api/v2/itemcates"
        },

        // 主数据加载地址
        master: {
            id: "product",

            name: "商品&服务",

            server: "/api/v2/itemtypes",

            submit: function (selected) {
                if(!$scope.beautydetails)
                {
                    $scope.beautydetails = [];
                }

                angular.forEach(selected, function (_beautydetail) {
                    var beautydetail = {createUserId:1, updateUserId: 1};

                    // 服务ID
                    beautydetail.serviceId = $scope.beauty.id;

                    angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "sellPrice", "packageUnit", "", "", ""], function (name) {
                        beautydetail[name] = _beautydetail[name];
                    });

                    // 个数
                    beautydetail.inputCount = 1;
                    // 总价
                    beautydetail.totalCost = 1;

                    $scope.beautydetails.push(beautydetail);
                    //
                    // // 备
                    // beautydetail.remark = _beautydetail.remark;
                });

                // 总项
                $scope.beauty.totalNum = $scope.beautydetails.length;

                // 总金额
                //
                // $scope.beauty.totalCost = $scope.beautydetails.length;
            }
        },

        // 综合搜索项
        filters : [{"fieldName": "itemCode","operator": "EQ", "value":""} , {"fieldName": "itemName","operator": "EQ", "value":""}],

        placeholder : "请输入宠物病例号/宠物昵称/会员编号/会员名称/会员电话"

    };

    $controller('TreeSidePortalController', {$scope: $scope, component: $scope.productportal}); //继承

    $scope.productportal.treeload();
    $scope.productportal.search();

});
