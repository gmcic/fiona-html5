
// 检验检测
angular.module('fiona').controller('CheckController', function($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxlist = [];

    $scope.dropdowns= {
        sampleSet: [{code:'', name: '全血' },{code:'', name: '粪便' },{code:'', name: '结石' },{code:'', name: '血清' },{code:'', name: '皮肤刮擦物/皮屑/毛发' },{code:'', name: '活检组织' },{code:'', name: '血浆' },{code:'', name: '采样拭子' },{code:'', name: '尿液' },{code:'', name: '穿剌抽吸液' },{code:'', name: '组织器官' },{code:'', name: '全血' },{code:'', name: '腹水' },{code:'', name: '肿块组织' }]
    };

    // 主数据加载地址
    $scope.master = {
        id: "check",

        name: "检验检测",

        server: "/api/v2/checkprocesssheets",

        insert: function () {

        }
    };

    // 综合搜索项
    $scope.filters = [{"code": "name","operator": "EQ", "value":""} , {"name": "name","operator": "EQ", "value":""} , {"contractMan": "name","operator": "EQ", "value":""} , {"mobilePhone": "name","operator": "EQ", "value":""} , {"dealerAddress": "name","operator": "EQ", "value":""}];

    $scope.placeholder = "请输入自动编号 / 经销商名称 / 联系人 / 手机 / 地址";

    $controller('BasePaginationController', {$scope: $scope}); //继承


    /**
     * 送检部位
     * ---------------------------
     * */
    $scope.checkpartportal = {
       id: "checkpart",

        name: "送检部位",

        insert: function () {

            $("#checkpart").modal('toggle');
        }
    }
});