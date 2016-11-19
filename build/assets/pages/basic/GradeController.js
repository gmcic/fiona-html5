
angular.module('fiona').controller('GradeController', function($scope, $controller, $http, commons) {

    /**
     * 会员等级管理
     * ---------------------------
     * */
    $scope.gradeportal= {

        id: "grade",

        name: "会员等级管理",

        server: "/api/v2/gestlevels"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.gradeportal}); //继承

    // // 主数据加载地址
    // $scope.master = {
    //     id: "grade",
    //
    //     name: "会员等级管理",
    //
    //     server: "/api/v2/gestlevels",
    // };
    //
    // $scope.placeholder = "请输入查询内容";
    //
    // $controller('BasePageFilterController', {$scope: $scope}); //继承

    $scope.gradeportal.search();
});