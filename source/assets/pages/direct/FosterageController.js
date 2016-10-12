
// 寄养管理

// 住院管理
angular.module('fiona').controller('FosterageController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = [
        {name: "managerIdSet", server: "personss"},  // 主管人员ID
        {name: "manufacturerIdSet", server: "personss"}, // 业务员id
        {name: "itemCodeSet", server: "personss"} // 寄养类型Code
    ];

    $scope.dropdowns= {};

    // 综合搜索项
    $scope.filters = [{"code": "name","operator": "EQ", "value":""} , {"name": "name","operator": "EQ", "value":""} , {"contractMan": "name","operator": "EQ", "value":""} , {"mobilePhone": "name","operator": "EQ", "value":""} , {"dealerAddress": "name","operator": "EQ", "value":""}];

    $scope.placeholder = "请输入自动编号 / 经销商名称 / 联系人 / 手机 / 地址";

    // 主数据加载地址
    $scope.master = {
        id: "fosterage",

        name: "住院管理",

        server: "/api/v2/fosterrecords",

        insert: function () {

        }
    };

    $controller('BasePaginationController', {$scope: $scope}); //继承

    // 寄养期间消费
    $scope.fosteragedetailportal = {
        master: {
            id: "fosteragedetail",

            name: "寄养期间消费",

            foreignkey: "serviceId", // 外键

            server: "/api/v2/fosterrecorddetails"
        },

        parent: {
            id: "fosterage"
        }
    };

    $controller('BasePortalController', {$scope: $scope, component: $scope.fosteragedetailportal}); //继承

    // 预付金额
    $scope.vipprepayportal = {
        master: {
            id: "vipprepay",

            name: "预付金额",

            foreignkey: "relationId", // 外键

            server: "/api/v2/prepaymoneys"
        },

        parent: {
            id: "fosterage"
        }
    };

    $controller('BasePortalController', {$scope: $scope, component: $scope.vipprepayportal}); //继承

    // 健康状态记录
    $scope.fosteragehealthportal = {
        master: {
            id: "fosteragehealth",

            name: "健康状态记录",

            foreignkey: "relationId", // 外键

            server: "/api/v2/fosterhealths"
        },

        parent: {
            id: "fosterage"
        }
    };

    $controller('BasePortalController', {$scope: $scope, component: $scope.fosteragehealthportal}); //继承

    // 选择宠物
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
                $scope.fosterage.gestId = $scope.pet.id;

                // 主人编号
                $scope.fosterage.gestCode = $scope.pet.gestCode;

                // 主人名称
                $scope.fosterage.gestName = $scope.pet.gestName;
            },
            submit: function () {
                // 主人ID
                $scope.fosterage.gestId = $scope.pet.id;

                // 主人编号
                $scope.fosterage.gestCode = $scope.pet.gestCode;

                // 主人名称
                $scope.fosterage.gestName = $scope.pet.gestName;
            },
            insert: function () {
                angular.forEach($scope.petportal.dropdowns, function (value, key) {
                    $scope.pet[key.substr(0, key.length - 3)] = value[0];
                });
            }
        },

        parent: {
            id: "fosterage"
        }
    };

    $controller('CommonVipController', {$scope: $scope, component: $scope.petportal}); //继承

    // 选择商品
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
                if(!$scope.fosteragedetails)
                {
                    $scope.fosteragedetails = [];
                }

                angular.forEach(selected, function (_fosteragedetail) {
                    var fosteragedetail = {createUserId:1, updateUserId: 1};

                    // 服务ID
                    // fosteragedetail.serviceId = $scope.fosterage.id;

                    angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "sellPrice", "packageUnit", "", "", ""], function (name) {
                        fosteragedetail[name] = _fosteragedetail[name];
                    });

                    // 个数
                    fosteragedetail.inputCount = 1;
                    // 总价
                    fosteragedetail.totalCost = 1;

                    $scope.fosteragedetails.push(fosteragedetail);
                    //
                    // // 备
                    // fosteragedetail.remark = _fosteragedetail.remark;
                });

                // 总项
                // $scope.fosterage.totalNum = $scope.fosteragedetails.length;

                // 总金额
                //
                // $scope.fosterage.totalCost = $scope.fosteragedetails.length;
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
