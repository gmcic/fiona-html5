
// 宠物管理
angular.module('fiona').controller('MedicalrecordController', function($scope, $controller, $http, commons) {

    $scope.dropdowns= { };

    commons.findDict($scope.dropdowns, {companyTypeSet: "厂家类型"});

    $controller('BaseController', {$scope: $scope}); //继承

    /**
     * 病案管理
     * ---------------------------
     * */
    $scope.medicalrecordportal= {

        id: "medicalrecord",

        name: "病案管理",

        defilters: {petName: "宠物昵称", gestName: "会员姓名", mediTreatmentCode: "就诊编号", doctor: "医生"},

        server: "/api/v2/medicmedictreatrecords",

        callback: {
            view: function () {

              $scope.vipportal.unique($scope.medicalrecord.gestId);
              $scope.petportal.unique($scope.medicalrecord.petId);

               $scope.doctorprescriptportal.searchByWhere({medicRecordCode: $scope.medicalrecord.mediTreatmentCode}, function(){

                   angular.forEach($scope.doctorprescripts, function(_doctorprescript){
                        $scope.doctorprescriptdetailportal.searchByWhere({prescriptionId: _doctorprescript.id}, function(details){
                            _doctorprescript.details = details;
                        });
                   });

               });
            }
        },
        payReturnVisit:function(obj){
          $scope.vipportal.unique(obj.gestId);
          $scope.petportal.unique(obj.petId);
          $scope.medicalrecord = obj;

          $("#pay_return_visitview").modal('show');
        },
        record:function(){
          // 查询医院信息
          $http.get(commons.getBusinessHostname() + this.server + "/payReturnVisit/" + $scope.medicalrecord.id + "?remark=" + $scope.medicalrecord.payReturnVisitRemark).success(function (data, status, headers, config) {
              $scope.medicalrecordportal.filter();
          });

          $("#pay_return_visitview").modal('hide');
        }
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.medicalrecordportal}); //继承

    /**
    * 医生处方
    * ---------------------------
    * */
    $scope.doctorprescriptportal = {
        id: "doctorprescript",

        name: "医生处方",

        server: "/api/v2/medicprescriptions"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.doctorprescriptportal}); //继承

    /**
    * 医生处方明细
    * ---------------------------
    * */
    $scope.doctorprescriptdetailportal = {

        foreign: "doctorprescript", // 外键

        foreignkey: "prescriptionId",

        id: "doctorprescriptdetail",

        name: "医生处方明细",

        server: "/api/v2/medicprescriptiondetails"
    };

    $controller('BaseCRUDController', {$scope: $scope, component: $scope.doctorprescriptdetailportal}); //继承

    // 查询医院信息
    $http.get(commons.getBusinessHostname() + "/api/v2/enterprises" + commons.getTimestampStr()).success(function (data, status, headers, config) {
        angular.forEach(data.data, function (item) {
            $scope.hospital = item;
        });
    });

    /**
     * 会员管理
     * ---------------------------
     * */
    $controller('VipPopupCheckedPanelController', {$scope: $scope}); //继承

    /**
     * 宠物管理
     * ---------------------------
     * */
    $controller('PetPopupCheckedPanelController', {$scope: $scope}); //继承

    $scope.petportal.callback.unique = function () {
        $scope.vipportal.unique($scope.pet.gestId);
    };

    $scope.medicalrecordportal.filter();

});