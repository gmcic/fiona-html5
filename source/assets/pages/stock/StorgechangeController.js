// 退回记录
angular.module('fiona').controller('StorgechangeController', function($scope, $filter, $controller, $http, commons) {

    $scope.dropdowns= {};

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

      // 仓库
      $scope.dropdownWithTable({id: "warehouseId", server: "/api/v2/warehouses", value: "id", text: "name"});

    // 仓库
    // $scope.dropdownWithTable({id: "warehouseId", server: "/api/v2/warehouses", value: "id", text: "name"});

    /**
     * 库存变更
     * ---------------------------
     * */
    $scope.storgechangeportal= {

        id: "storgechange",

        name: "库存变更",

        server: "/api/v2/itemcountchangereasons",

        defilters: {"warehouseName": "仓库名称", "itemCode": "商品编号", "itemName": "商品名称"},

          onchange: function () {
            angular.forEach($scope.dropdowns.warehouseIdSet, function (data) {
              if($scope.storgechange.warehouseCode == data.id)
              {
                $scope.storgechange.warehouseName = data.valueNameCn;

                if($scope.storgechange.warehouseCode && $scope.storgechange.itemCode)
                {
                  $scope.itemcountsportal.searchByWhere({"itemCode": $scope.storgechange.itemCode, "warehouseId": $scope.storgechange.warehouseCode});
                }
              }
            });
          },
        callback: {
          update: function () {
            $scope.storgechange.sourceOutDateTime = $filter('date')($scope.storgechange.sourceOutDateTime, 'yyyy-MM-dd'); //format
            $scope.storgechange.newOutDateTime = $filter('date')($scope.storgechange.newOutDateTime, 'yyyy-MM-dd'); //format
          }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.storgechangeportal}); //继承

    /**
     * 库存变更
     * ---------------------------
     * */
    $scope.itemcountsportal = {

        id: "itemcounts",

        name: "库存变更",

        server: "/api/v2/itemcounts",

        callback: {
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.itemcountsportal}); //继承


  /**
   * 搜索
   * ---------------------------
   * */
  $scope.itemcountsportal.searchByWhere = function(condition, invoke){

    var filters = [];

    angular.forEach(condition, function(data, key){
      filters.push({"fieldName": key, "operator": "EQ", "value": data});
    });

    $http.post(commons.getBusinessHostname() + this.server + "/page" + commons.getTimestampStr(), { 'pageSize': 10000, 'pageNumber': 1,"filters":[], 'andFilters': filters})
      .success(function (data, status, headers, config) {
        var items = data.data.content;

        if (items && items.length > 0)
        {
          var data = items[0];

          // 类型数量ID
          $scope.storgechange.itemCountId = data.id;

          // 原资源数量
          $scope.storgechange.sourceCount = data.itemCountNum;

          // 原洒落数量
          $scope.storgechange.sourceScatteredCount = data.scatteredCountNum;

          // 原批次号
          $scope.storgechange.sourceBatchNumber = data.batchNumber;

          // 原过期时间
          $scope.storgechange.sourceOutDateTime = data.outDateTime;
        }

      });
  };

  /**
   * 弹出选择商品
   * ---------------------------
   * */
  $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

  $scope.productportal.checked = function (_product) {
      $scope.storgechange.itemCode = _product.itemCode;
      $scope.storgechange.itemName = _product.itemName;

      if($scope.storgechange.warehouseCode && _product.itemCode)
      {
          $scope.itemcountsportal.searchByWhere({"itemCode": _product.itemCode, "warehouseId": $scope.storgechange.warehouseCode});
      }
  };



  $scope.productportal.autocompletedata();

  // 初始化列表
  $scope.storgechangeportal.filter();
});
