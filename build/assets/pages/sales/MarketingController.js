
// 直接销售
angular.module('fiona').controller('MarketingController', function($scope, $controller) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = [
        {name: "assistantDoctorIdSet", server: "personss"}  // 服务助理ID
    ];

    $scope.dropdowns= {};

    // 主数据加载地址
    $scope.master = {
        id: "marketing",

        name: "销售查询",

        server: "/api/v2/storedirectsells"
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

    
});
