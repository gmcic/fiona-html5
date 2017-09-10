// 员工管理
angular.module('fiona').controller('PersonnelController', function ($scope, $http, commons, $controller) {

  $scope.dropdowns = {
    isSyncEasSet: [{id: "true", valueNameCn: "是"}, {id: "false", valueNameCn: "否"}],
    roleSet: []
  };

  commons.findDict($scope.dropdowns, {personStatusSet: "会员状态", sexSet: "性别"});

  $controller('BaseController', {$scope: $scope}); //继承

  /**
   * 员工管理
   * ---------------------------
   * */
  $scope.personnelportal = {

    id: "personnel",

    name: "员工管理",

    server: "/api/v2/personss",

    defilters: {
      "personCode": "员工编号",
      "personName": "员工名称 "
    },

    callback: {
      update: function () {
        // 加载角色选项
        $scope.roleportal.list();
      },
      insert: function () {
        // 加载角色选项
        $scope.roleportal.list();
        $scope.setSelectDefault("personnel", ["isSyncEas", "personStatus", "sex", "roleId"]);

        $http.get(commons.getBusinessHostname() + "/api/v2/appconfigs/genNumberByName?name=会员编号").success(function (data, status, headers, config) {

          $scope.personnel.personCode = data.data;

        }).error(function (data, status, headers, config) { //     错误
          commons.modaldanger("vip", "生成会员编号失败");
        });
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.personnelportal}); //继承

  /**
   * 角色
   * ---------------------------
   * */
  $scope.roleportal = {

    id: "role",

    name: "角色管理",

    defilters: {},

    server: "/api/v2/roles"
  };

  /**
   * 搜索不分页
   * ---------------------------
   * */
  $scope.roleportal.list = function () {
    $scope['roles'] = [{id:'nurse', code:'nurse', name:'护士'},{id:'service',code:'service', name:'美容'},{id:'doctor',code:'doctor', name:'医生'}];  
    $scope.dropdowns.roleSet = [{}];
    $scope.roles.forEach(function (role) {
      $scope.dropdowns.roleSet.push({id: role.code, valueNameCn: role.name});
    });

    // $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {}).success(function (data, status, headers, config) {

    //   $scope['roles'] = data.data;

    //   var roleSet = [{}];
    //   $scope.roles.forEach(function (role) {
    //     roleSet.push({id: role.code, valueNameCn: role.name});
    //   });
    // });
  };

  $scope.personnelportal.filter();
});
