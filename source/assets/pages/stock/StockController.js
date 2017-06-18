// 库存查询
angular.module('fiona').controller('StockController', function($scope, $controller,  $http, commons) {

    $scope.dropdowns= {};

    commons.findDict($scope.dropdowns, {drugFormSet: "物品单位", packageUnitSet: "物品单位"});

    // 继承能用代码
    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 库存查询
     * ---------------------------
     * */
    $scope.stockportal= {

        foreign: "storage", // 外键

        foreignkey: "warehouseId",

        id: "stock",

        name: "库存查询",

        defilters: {"itemName": "名称",  "itemCode": "编号",  "barCode": "条码", "manufacturerName": "生产商", "inputCode": "拼音码"},

        server: "/api/v2/itemcounts",
        
        order:function(){
            $scope.orders = [];

            $http.get(commons.getBusinessHostname() + this.server + "/order")
                .success(function (data, status, headers, config) {
                    var items = data.data;

                    if (items && items.length > 0)
                    {
                        $scope.orders = items;
                    }
                });

            $("#orderview").modal('show');
        },
        print:function () {
            var headstr = "<html><head><title></title></head><body>";
            var footstr = "</body>";
            var newstr = document.all.item('orderview').innerHTML;
            var oldstr = document.body.innerHTML;
            document.body.innerHTML = headstr+newstr+footstr;
            window.print();
            document.body.innerHTML = oldstr;
            return false;
        }

        
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.stockportal}); //继承


    /**
     * 仓库
     * ---------------------------
     * */
    $scope.storageportal = {
        id: "storage",

        name: "仓库",

        server: "/api/v2/warehouses",

        callback: {
            switched: function () {
                $scope.stockportal.search();
            }
        }
    };

    $controller('SidePanelController', {$scope: $scope, component: $scope.storageportal}); //继承

    $scope.storageportal.init();

});