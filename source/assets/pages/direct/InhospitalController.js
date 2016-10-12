// 住院管理
angular.module('fiona').controller('InhospitalController', function ($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = [
        {name: "managerIdSet", server: "personss"},  // 主管人员ID
        {name: "manufacturerIdSet", server: "personss"}, // 业务员id
        {name: "itemCodeSet", server: "personss"} // 寄养类型Code
    ];

    $scope.dropdowns = {};

    // 综合搜索项
    $scope.filters = [{"code": "name", "operator": "EQ", "value": ""}, {
        "name": "name",
        "operator": "EQ",
        "value": ""
    }, {"contractMan": "name", "operator": "EQ", "value": ""}, {
        "mobilePhone": "name",
        "operator": "EQ",
        "value": ""
    }, {"dealerAddress": "name", "operator": "EQ", "value": ""}];

    $scope.placeholder = "请输入自动编号 / 经销商名称 / 联系人 / 手机 / 地址";

    // 主数据加载地址
    $scope.master = {
        id: "inhospital",

        name: "住院管理",

        server: "/api/v2/inhospitalrecords",

        insert: function () {

        }
    };

    $controller('BasePaginationController', {$scope: $scope}); //继承

    /**
     * 寄养期间消费
     * ---------------------------
     * */
    $scope.inhospitaldetailportal = {
        master: {
            id: "inhospitaldetail",

            name: "寄养期间消费",

            foreignkey: "serviceId", // 外键

            server: "/api/v2/inhospitalrecorddetails"
        },

        parent: {
            id: "inhospital"
        }
    };

    $controller('BasePortalController', {$scope: $scope, component: $scope.inhospitaldetailportal}); //继承

    /**
     * 预付金额
     * ---------------------------
     * */
    $scope.vipprepayportal = {
        master: {
            id: "vipprepay",

            name: "预付金额",

            foreignkey: "relationId", // 外键

            server: "/api/v2/prepaymoneys"
        },

        parent: {
            id: "inhospital"
        }
    };

    $controller('BasePortalController', {$scope: $scope, component: $scope.vipprepayportal}); //继承

    /**
     * 健康状态记录
     * ---------------------------
     * */
    $scope.inhospitalhealthportal = {
        master: {
            id: "inhospitalhealth",

            name: "健康状态记录",

            foreignkey: "relationId", // 外键

            server: "/api/v2/inhospitalhealths"
        },

        parent: {
            id: "inhospital"
        }
    };

    $controller('BasePortalController', {$scope: $scope, component: $scope.inhospitalhealthportal}); //继承

    /**
     * 住院处方
     * ---------------------------
     * */
    $scope.inhospitalprescriptiondetailportal = {
        slave: {
            name: "处方",
            server: "/api/v2/inhospitalprescriptions"
        },

        // 主数据加载地址
        master: {
            id: "inhospitalprescriptiondetail",
            name: "住院处方",
            foreignkey: "dictTypeId",
            server: "/api/v2/inhospitalprescriptiondetails",
        }
    };

    $controller('SidePortalController', {$scope: $scope, component: $scope.inhospitalprescriptiondetailportal}); //继承

    $scope.inhospitalprescriptiondetailportal.init();

    /**
     * 弹出选择宠物
     * ---------------------------
     * */
    $controller('PetPopupSelectController', {$scope: $scope}); //继承

    $scope.petportal.master.checked = function () {
        // 主人ID
        $scope.inhospital.gestId = $scope.pet.id;

        // 主人编号
        $scope.inhospital.gestCode = $scope.pet.gestCode;

        // 主人名称
        $scope.inhospital.gestName = $scope.pet.gestName;
    };

    $scope.petportal.master.submit = function () {
        // 主人ID
        $scope.inhospital.gestId = $scope.pet.id;

        // 主人编号
        $scope.inhospital.gestCode = $scope.pet.gestCode;

        // 主人名称
        $scope.inhospital.gestName = $scope.pet.gestName;
    };

    $scope.petportal.master.insert = function () {
        angular.forEach($scope.petportal.dropdowns, function (value, key) {
            $scope.pet[key.substr(0, key.length - 3)] = value[0];
        });
    };

    /**
     * 弹出选择商品
     * ---------------------------
     * */
    $controller('ProductPopupSelectController', {$scope: $scope}); //继承

    $scope.productportal.master.submit = function (selected) {
        if (!$scope.inhospitaldetails) {
            $scope.inhospitaldetails = [];
        }

        angular.forEach(selected, function (_inhospitaldetail) {
            var inhospitaldetail = {createUserId: 1, updateUserId: 1};

            // 服务ID
            // inhospitaldetail.serviceId = $scope.inhospital.id;

            angular.forEach(["itemCode", "itemName", "itemStandard", "barCode", "sellPrice", "packageUnit", "", "", ""], function (name) {
                inhospitaldetail[name] = _inhospitaldetail[name];
            });

            // 个数
            inhospitaldetail.inputCount = 1;
            // 总价
            inhospitaldetail.totalCost = 1;

            $scope.inhospitaldetails.push(inhospitaldetail);
            //
            // // 备
            // inhospitaldetail.remark = _inhospitaldetail.remark;
        });

        // 总项
        // $scope.inhospital.totalNum = $scope.inhospitaldetails.length;

        // 总金额
        //
        // $scope.inhospital.totalCost = $scope.inhospitaldetail.length;
    };

    $scope.productportal.init();
});
