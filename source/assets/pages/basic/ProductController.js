// 商品与服务管理
angular.module('fiona').controller('ProductController', function ($scope, $controller, $http, commons) {

    // 声明要使用的下拉选项
    $scope.dropboxargs = {
        // dicts: {},

        // 销售单位 , recipeUnitSet: "物品单位"
        userdicts: {packageUnitSet: "物品单位", drugFormSet: "剂型"},
        
        callback: {
            userdicts : function () {
                // 处方单位
                $scope.dropdowns.recipeUnitSet = $scope.dropdowns.packageUnitSet;

                $scope.producttypeportal.init();

                $scope.productportal.filter();
            }
        }
    };

    // 是否打折: isVipDiscount, 是否销售: isSell, 是否记库: isCount
    $scope.dropdowns = {isVipDiscountSet: [{id: "是", valueNameCn: "是"}, {id: "否", valueNameCn: "否"}]};

    $controller('BaseController', {$scope: $scope}); //继承


    /**
     * 商品&服务分类
     * ---------------------------
     * */
    $scope.producttypeportal= {

        text: "cateName", // 树标签-字段名

        parent: "parentId", // 父引用-字段名

        foreign: "producttype",

        foreignkey: "cateNo",

        id: "producttype",

        name: "商品&服务分类",

        server: "/api/v2/itemcates",

        callback: {
            switched: function () {
                // 加载
                $scope.productportal.search();
            },
            insert: function () {
                // 加载
                if (!$scope.producttypeportal.selectedId) {
                    $scope.producttype.parentId = "#";
                    $scope.producttypeportal.selected = {cateName: "顶级"}
                }
                else {
                    $scope.producttype.parentId = $scope.producttypeportal.selectedId;
                }
            },
            submit: function () {
                $scope.producttypeportal.search();
                $scope.producttypeportal.treeConfig.version++;
            },
            delete: function () {
                $scope.producttypeportal.search();
                $scope.producttypeportal.treeConfig.version++;
            }
        }
    };

    $controller('TreeSidePanelController', {$scope: $scope, component: $scope.producttypeportal}); //继承

    /**
     * 商品&服务
     * ---------------------------
     * */
    $scope.productportal= {

        foreign: "producttype", // 外键

        foreignkey: "cateNo",

        id: "product",

        name: "商品&服务",

        server: "/api/v2/itemtypes",

        defilters: {"itemCode": "商品编号", "itemName": "商品名称"},

        callback: {
            insert: function () {
                $scope.setSelectDefault("product", ["packageUnit", "drugForm", "isVipDiscount", "isSell", "isCount", "isCanExchangeSet"]);
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.productportal}); //继承

    // 会员等级, 会员状态
    $scope.dropboxinit($scope.dropboxargs);

    $scope.dropdowns.isSellSet = $scope.dropdowns.isVipDiscountSet;
    $scope.dropdowns.isCountSet = $scope.dropdowns.isVipDiscountSet;
    $scope.dropdowns.isCanExchangeSet = $scope.dropdowns.isVipDiscountSet;

    $scope.dropdownWithTable({id: "busiTypeId", server: "/api/v2/businescates", value: "id", text: "cateName"});
});

