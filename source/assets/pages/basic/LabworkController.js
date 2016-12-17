// 化验项目管理
angular.module('fiona').controller('LabworkController', function ($scope, $controller, $http, commons) {

    $scope.dropdowns= { indexTypeSet: [{id: "1", valueNameCn: "定量"}, {id: "2", valueNameCn: "定性"}] };

    commons.findDict($scope.dropdowns, {petRaceNameSet: "医疗类型", cheTestUnitSet: "化验单位"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 化验项目分类
     * ---------------------------
     * */
    $scope.labworktypeportal= {

        text: "cateName", // 树标签-字段名

        parent: "parent_id", // 父引用-字段名

        foreign: "labworktype",

        foreignkey: "cateNo",

        id: "labworktype",

        name: "化验项目分类",

        server: "/api/v2/chemicalexamcates",

        callback: {
            switched: function () {
                // 加载
                $scope.labworkportal.search();
            },
            submit: function () {

                $scope.labworktypeportal.refresh();
            },
            delete: function () {
                $scope.labworktypeportal.cancelSelected();

                $scope.labworktypeportal.refresh();
            }
        }
    };

    $controller('TreeSidePanelController', {$scope: $scope, component: $scope.labworktypeportal}); //继承

    /**
     * 化验项目
     * ---------------------------
     * */
    $scope.labworkportal= {

        foreign: "labworktype", // 外键

        foreignkey: "cateNo",

        id: "labwork",

        name: "化验项目管理",

        server: "/api/v2/medicchemicalexamtypes",

        defilters: {"cheTestName": "参数名称", "cateNo": "编号"},

        callback : {
            insert: function () {
                $scope.setSelectDefault("labwork", ["indexType", "cheTestUnit"]);
                $scope.labworkdetails = [];
            },
            submit: function () {
                // 遍历保存所有子项
                angular.forEach($scope.labworkdetails, function (labworkdetail, index, array) {

                    labworkdetail.cheTestTypdId = $scope.labwork.id;

                    $scope.labworkdetailportal.saveWithEntity(labworkdetail);
                });

            },
            update: function () {
                $scope.labworkdetailportal.search($scope.labwork.id);
            }
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.labworkportal}); //继承

    /**
     * 参考值设置
     * ---------------------------
     * */
    $scope.labworkdetailportal= {

        foreign: "labwork", // 外键

        foreignkey: "cheTestTypdId",

        id: "labworkdetail",

        name: "参考值设置",

        server: "/api/v2/medicchemicalexamtypedetails",

        callback : {
            insert: function () {
                $scope.setSelectDefault("labworkdetail", ["petRaceName"]);
            }
         }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.labworkdetailportal}); //继承

    $scope.labworkdetailportal.submit = function() {
        $scope.labworkdetails.unshift($scope.labworkdetail);
        $('#labworkdetail').modal('hide');
    }

    $scope.labworktypeportal.search();
    $scope.labworkportal.filter();
});