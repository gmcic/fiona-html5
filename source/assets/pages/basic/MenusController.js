// 角色管理
angular.module('fiona').controller('MenusController', function ($scope, $controller, $http, commons) {

  $scope.dropdowns = {};

  commons.findDict($scope.dropdowns, {petRaceNameSet: "厂家类型"});

  $controller('BaseController', {$scope: $scope}); //继承

  /**
   * 菜单管理
   * ---------------------------
   * */
  $scope.menusportal = {

    id: "menus",

    name: "角色管理",

    defilters: {},

    server: "/api/v2/menus",

    callback: {
      insert: function () {
        $scope.parentName = $scope.menusideportal.selected.name;
        $scope.menus = {parentId: $scope.menusideportal.selected.id, parentCode: $scope.menusideportal.selected.code, iconClass: 'nav-item'};
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.menusportal}); //继承

  /**
   * 搜索不分页
   * ---------------------------
   * */
  $scope.menusportal.query = function (parentCode) {
    $http.post(commons.getAccountHostname() + this.server + "/page" + commons.getTimestampStr(), {
      pageSize: 10000,
      pageNumber: 1,
      filters: [{
        "fieldName": "parentCode",
        "operator": "LIKE",
        "value": parentCode 
      }]
    }).success(function (data, status, headers, config) {

      // this.selectionReset();

      console.log("菜单列表", data.data);

      $scope['menuss'] = data.data;
    });
  };


  /**
   * 保存
   * ---------------------------
   * */
  $scope.menusportal.submit = function () {

    console.log("submit", $scope.menus);
    $scope[this.id + "form"].submitted = true;

    if ($scope[this.id + "form"].$valid) {

      $http.post(commons.getAccountHostname() + this.server + commons.getTimestampStr(), $scope[this.id]).success(function (data, status, headers, config) {

        $scope[$scope.menusportal.id] = data.data;

        // $scope.menusportal.refresh();

        $scope['menusides'] = data.data;

        $scope.menusideportal.list();
        $scope.menusideportal.treeConfig.version++;

        $('#' + $scope.menusportal.id).modal('hide');

        commons.success("保存成功")
      }).error(function (data, status, headers, config) { //     错误

        commons.modaldanger($scope.menusportal.id, "保存失败")
      });
    }
  };


  /**
   * 菜单
   * ---------------------------
   * */
  $scope.menusideportal = {

    id: "menuside",

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
      types: {
        default: {
          icon: 'fa fa-folder icon-state-warning icon-lg'
        },
        file: {icon: "fa fa-file icon-state-warning icon-lg"}
      },
      version: 1,
      plugins: ['types']
    },

    // 树事件
    treeEventsObj: {
      'select_node': function (e, item) {

        $scope.menusideportal.selectedId = item.selected[0];

        angular.forEach($scope.menusides, function (data) {

          // console.log('EQ', {"SELECT ID": $scope.menusideportal.selectedId, "DATA ID": data.id});

          if (data.id == $scope.menusideportal.selectedId) {
            $scope.menusideportal.selected = data;
            $scope.menuside = data;
          }
        });

        // 查询子节点
        $scope.menusportal.query($scope.menusideportal.selected.code);

        // console.log('selectedId', $scope.menusideportal.selectedId);
        // console.log('select_node', $scope.menusideportal.selected);
      }
    },

    list: function () {
      $http.post(commons.getAccountHostname() + this.server + "/list" + commons.getTimestampStr(), {}).success(function (data, status, headers, config) {

        // console.log("菜单", data.data);

        angular.forEach(data.data, function (item) {
          item.text = item.name;
          item.parent = item.parentId || "#";
          // item.parent = "#";
          // // console.log("Text: " + item.text)
          // // console.log("Parent: " + item.parent)
        });

        $scope['menusides'] = data.data;

        $scope.menusideportal.treeConfig.version++;
      });
    }
  };

  // $scope.menusportal.list();
  $scope.menusideportal.list();
});