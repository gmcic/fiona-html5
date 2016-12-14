
// 检验检测
angular.module('fiona').controller('CheckController', function($scope, $controller, $http, commons) {

    $scope.dropdowns = {
        sampleSet: [{id:'', valueNameCn: '全血' },{id:'', valueNameCn: '粪便' },{id:'', valueNameCn: '结石' },{id:'', valueNameCn: '血清' },{id:'', valueNameCn: '皮肤刮擦物/皮屑/毛发' },{id:'', valueNameCn: '活检组织' },{id:'', valueNameCn: '血浆' },{id:'', valueNameCn: '采样拭子' },{id:'', valueNameCn: '尿液' },{id:'', valueNameCn: '穿剌抽吸液' },{id:'', valueNameCn: '组织器官' },{id:'', valueNameCn: '全血' },{id:'', valueNameCn: '腹水' },{id:'', valueNameCn: '肿块组织' }]
    };

    commons.findDict($scope.dropdowns, {personStatusSet: "会员状态", sexSet: "性别"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 检验检测
     * ---------------------------
     * */
    $scope.checkportal = {

        id: "check",

        name: "检验检测",

        server: "/api/v2/checkprocesssheets",

        defilters: {"personCode": "员工编号", "personName": "员工名称 "}
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.checkportal}); //继承

    /**
     * 送检部位
     * ---------------------------
     * */
    $scope.checkpartportal = {
       id: "checkpart",

        name: "送检部位",

        insert: function () {
            $("#checkpart").modal({backdrop: 'static', keyboard: false});
        }
    }
});