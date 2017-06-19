// 角色管理
angular.module('fiona').controller('RoleController', function ($scope, $controller, $http, commons) {

  $scope.dropdowns = {};

  commons.findDict($scope.dropdowns, {petRaceNameSet: "厂家类型"});

  $controller('BaseController', {$scope: $scope}); //继承

  /**
   * 角色
   * ---------------------------
   * */
  $scope.roleportal = {

    id: "role",

    name: "角色管理",

    defilters: {},

    server: "/api/v2/roles",

    callback: {
      insert: function () {
        $scope.setSelectDefault("role", ["companyType"]);
      },
      update: function () {
        // 查义用户和树
        var _role = $scope.role;

        $scope.rolemenuportal.query(_role.code);
        $scope.userroleportal.query(_role.id);
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.roleportal}); //继承

  /**
   * 搜索不分页
   * ---------------------------
   * */
  $scope.roleportal.list = function () {
    $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {}).success(function (data, status, headers, config) {

      // this.selectionReset();

      console.log("角色列表", this.id, data.data);

      $scope['roles'] = data.data;
    });
  };


  /**
   * 用户
   * ---------------------------
   * */
  $scope.userportal = {

    id: "user",

    name: "用户",

    defilters: {},

    server: "/api/v2/users"
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.userportal}); //继承

  $scope.userportal.list = function () {
    $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {}).success(function (data, status, headers, config) {

      // this.selectionReset();

      console.log("用户列表", this.id, data.data);

      $scope['users'] = data.data;
    });
  };

  /**
   * 角色-用户
   * ---------------------------
   * */
  $scope.userroleportal = {

    id: "userrole",

    name: "角色-用户",

    defilters: {},

    server: "/api/v2/userroles"
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.userroleportal}); //继承

  $scope.userroleportal.query = function (roleId) {
    $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {filters: [{"fieldName": "roleId", "operator": "EQ", "value":roleId}]}).success(function (data, status, headers, config) {

      // this.selectionReset();

      console.log("角色-用户", this.id, data.data);

      $scope['userroles'] = data.data;
    });
  };

  /**
   * 角色-菜单
   * ---------------------------
   * */
  $scope.rolemenuportal = {

    id: "rolemenu",

    name: "角色-菜单",

    defilters: {},

    server: "/api/v2/rolemenus"
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.rolemenuportal}); //继承

  $scope.rolemenuportal.query = function (roleCode) {
    $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {filters: [{"fieldName": "roleCode", "operator": "EQ", "value":roleCode}]}).success(function (data, status, headers, config) {

      // this.selectionReset();

      console.log("角色-菜单", this.id, data.data);

      $scope['rolemenu'] = data.data;
    });
  };


  /**
   * 菜单
   * ---------------------------
   * */
  $scope.menusportal = {

    id: "menus",

    name: "菜单",

    defilters: {},

    server: "/api/v2/menus",


    /**
     * 目录树配置
     * ---------------------------
     * */
    treeConfig: {
      core: {
        themes: {responsive: !1},
        multiple: true,
        animation: false,
        error: function (error) {
          alert("error from js tree - " + angular.toJson(error));
        },
        check_callback: true,
        worker: true
      },
      checkbox: {

        tie_selection:false,
      },
      types: {
        default: {
          icon: 'fa fa-folder icon-state-warning icon-lg'
        },
        file: {icon: "fa fa-file icon-state-warning icon-lg"}
      },
      version: 1,
      plugins: ['types', 'checkbox']
    },

    // 树事件
    treeEventsObj: {
      'check_node': function (e, item) {
        console.log("scope", $scope);
        console.log('check_node', item);
      },

      'uncheck_node': function (e, item) {
        console.log("uncheck_node", item);
      }
    },

    list: function () {
      $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {}).success(function (data, status, headers, config) {

        console.log("菜单", data.data);

        angular.forEach(data.data, function (item) {
          item.text = item.name;
          item.parent = item.parentId || "#";
          // item.parent = "#";
          // // console.log("Text: " + item.text)
          // // console.log("Parent: " + item.parent)
        });

        $scope['menuss'] = data.data;

        $scope.menusportal.treeConfig.version++;
      });
    }
  };

  // 初始化
  $scope.roleportal.list();
  $scope.userportal.list();
  $scope.menusportal.list();
});