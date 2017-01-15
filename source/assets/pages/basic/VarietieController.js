
// 宠物品种管理
angular.module('fiona').controller('VarietieController', function($scope, $controller, $http, commons) {

    /**
     * 宠物品种
     * ---------------------------
     * */
    $scope.varietieportal= {

        foreign: "varietietype", // 外键

        foreignkey: "petRace",

        id: "varietie",

        name: "品种",

        server: "/api/v2/varieties"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.varietieportal}); //继承

    /**
     * 不分页搜索
     * ---------------------------
     * */
    $scope.varietieportal.search = function () {

      $http.post(commons.getBusinessHostname() + this.server + "/page", { 'pageSize': 10000, 'pageNumber': 1,"filters":[],"andFilters":[{"fieldName":"petRaceObject.id","operator":"EQ","value"
        :$scope.varietietype.id}]}).success(function (data, status, headers, config) {

        $scope[this.id + 's'] = data.data.content;

        if(!!this.callback && !!this.callback.search)
        {
          this.callback.search();
        }
      });
    };
    /**
     * 宠物种类
     * ---------------------------
     * */
    $scope.varietietypeportal = {
        id: "varietietype",

        name: "种类",

        server: "/api/v2/petraces",

        callback: {
            switched: function () {
                $scope.varietieportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.varietietypeportal}); //继承

    $scope.varietietypeportal.init();
});