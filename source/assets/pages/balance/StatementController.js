// 支出管理
angular.module('fiona').controller('StatementController', function ($scope, $controller, commons) {

  $scope.dropdowns = {};

  commons.findDict($scope.dropdowns, {types: "厂家类型", packageUnitSet: "物品单位"});

  $controller('BaseController', {$scope: $scope}); //继承

  /**
   * 结算单管理
   * ---------------------------
   * */
  $scope.statementportal = {

    id: "statement",

    name: "结算单管理",

    server: "/api/v2/financesettleaccountss",

    defilters: {"gestName": "会员名称 "},

    callback: {
      view: function () {
        $scope.statementdetailportal.searchAll();
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.statementportal}); //继承

  $scope.statementportal.print2 = function (_statement) {
    $scope.detailhide = true;
    $scope.statementportal.print(_statement);
  };

  $scope.statementportal.print1 = function (_statement) {
    $scope.detailhide = false;
    $scope.statementportal.print(_statement);
  };

  $scope.statementportal.print = function (_statement) {

    $scope.nowtime = new Date();

    $scope.statement = _statement;

    $scope.vipportal.unique(_statement.gestId);

    $scope.statementdetailportal.searchAll();

    $('#statementprint').modal({backdrop: 'static', keyboard: false});
  };

  // 打印页面
  $scope.print = function () {
    document.getElementById('printiframe').contentWindow.document.getElementById('printBody').innerHTML = $('#statementprintbody').html();
    document.getElementById('printiframe').contentWindow.print();
    // $('#doctorprescriptprint').modal({backdrop: 'static', keyboard: false});
  };

  /**
   * 结算单明细
   * ---------------------------
   * */
  $scope.statementdetailportal = {

    foreign: "statement", // 父表的标识

    foreignkey: "settleAccountsDetailId", // 表关联使用的字段

    id: "statementdetail",

    name: "结算单明细",

    server: "/api/v2/financesettleaccountsdetails",

    callback: {
      search: function () {
        angular.forEach($scope.statementdetails, function (_statementdetail) {
          _statementdetail.sumprice = _statementdetail.totalCost * _statementdetail.totalNum;
        });
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.statementdetailportal}); //继承

  /**
   * 会员管理
   * ---------------------------
   * */
  $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

  $scope.statementportal.filter();
});
