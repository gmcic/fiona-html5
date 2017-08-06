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

        $scope.rolemenuportal.list(_role.code);

        // 加载角色-用户关联
        $scope.userroleportal.list(_role.id);
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.roleportal}); //继承

  $scope.roleportal.submit = function () {
    $scope[this.id + "form"].submitted = true;

    delete $scope[this.id].parentObject;

    if ($scope[this.id + "form"].$valid) {

      delete $scope[this.id].text;
      delete $scope[this.id].parent;

      $http.post(commons.getAccountHostname() + this.server + commons.getTimestampStr(), $scope[this.id]).success(function (data, status, headers, config) {
        $scope['role'] = data.data;
        $scope['role' + "s"].unshift(data.data);

        $scope.userroleportal.save($scope.role.id);
        $scope.rolemenuportal.save($scope.role.code);

        $('#' + 'role').modal('hide');
        commons.success("保存成功")
      }).error(function (data, status, headers, config) { //     错误

        commons.modaldanger(this.id, "保存失败")
      });
    }
  };

  /**
   * 搜索不分页
   * ---------------------------
   * */
  $scope.roleportal.list = function () {
    $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {}).success(function (data, status, headers, config) {

      // this.selectionReset();

      // console.log("角色列表", this.id, data.data);

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

  $scope.userportal.selectChange = function () {

    $scope.userportal.isRemoves = true;

    angular.forEach($scope.userportal.selection, function (value, key) {

      // console.log("user selection", value, key, typeof key);

      if (value == true) {
        $scope.userportal.isRemoves = false;
      }
    });
  };

  $scope.userportal.selectAll = function () {

    angular.forEach($scope['users'], function (data) {
      // console.log("SelectAll Item", data);
      $scope.userportal.selection[data.id] = $scope.userportal.selectedall;
    });

    $scope.userportal.isRemoves = !$scope.userportal.selectedall
  };


  $scope.userportal.list = function (success) {
    $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {}).success(function (data, status, headers, config) {

      // this.selectionReset();

      // console.log("用户列表", this.id, data.data);

      $scope['users'] = data.data;

      $scope.userportal.selection = {};
      angular.forEach($scope.userroles, function (userrole) {
        // console.log("User Role", userrole);
        $scope.userportal.selection[userrole.userId] = true;
      });
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

  $scope.userroleportal.list = function (roleId) {
    $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {
      filters: [{
        "fieldName": "roleId",
        "operator": "EQ",
        "value": roleId
      }]
    }).success(function (data, status, headers, config) {
      $scope['userroles'] = data.data;

      // 加载用户
      $scope.userportal.list();
    });
  };

  $scope.userroleportal.save = function (roleId) {
    // alert(roleId);
    angular.forEach($scope.userportal.selection, function (value, key) {
      console.log(roleId, key, value);
    })
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

  $scope.rolemenuportal.list = function (roleCode) {
    $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {
      filters: [{
        "fieldName": "roleCode",
        "operator": "EQ",
        "value": roleCode
      }]
    }).success(function (data, status, headers, config) {
      // console.log("角色-菜单", this.id, data.data);
      $scope['rolemenus'] = data.data;

      var check = {};

      angular.forEach($scope.rolemenus, function (rolemenu) {
        check[rolemenu.menuCode] = true;
      });

      $scope.menusportal.list(check)
    });
  };

  $scope.rolemenuportal.save = function (roleCode) {
    // 获取选中的菜单
    var checked = $scope.treeInstance.jstree(true).get_checked();

    console.log(checked);
    // $scope.menusportal.treeEventsObj.
    angular.forEach($scope.menuss, function (data) {
      if (checked.indexOf(data.id) != -1) {
        console.log(roleCode, data.code);
      }
    })
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
        'tie_selection': false
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
        // alert('check_node: ' + item.node.id);
        // console.log('check_node', item);
        // console.log("scope", $scope);
        // console.log('check_node', item);
      },

      'uncheck_node': function (e, item) {
        // alert('uncheck_node: ' + item.node.id);
        // console.log('uncheck_node', item);
        // console.log("uncheck_node", item);
      }
    },

    list: function (check) {
      $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {}).success(function (data, status, headers, config) {

        // console.log("菜单", data.data);

        angular.forEach(data.data, function (item) {
          item.text = item.name;
          item.parent = item.parentId || "#";
          if (check[item.code]) {
            item.state = {checked: true};
          }
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
  // $scope.userportal.list();
  // $scope.menusportal.list();
});