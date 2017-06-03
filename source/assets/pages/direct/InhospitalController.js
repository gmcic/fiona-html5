// 住院管理
angular.module('fiona').controller('InhospitalController', function ($scope, $controller, $http, commons) {

  $scope.dropdowns = {};

  commons.findDict($scope.dropdowns, {
    manufacturerIdSet: "业务员",
    managerIdSet: "主管人员",
    recipeUnitSet: "物品单位",
    frequencySet: "用药频次",
    useWaySet: "药品使用方法",
    useUnitSet: "物品单位",
    paidStatusSet: "付款状态"
  });

  $controller('BaseController', {$scope: $scope}); //继承

  // 住院类型
  // $scope.dropdownWithTable({id: "itemCode", server: "/api/v2/itemtypes", condition : {"cateNo": "7b3fe252-bddd-4ffe-9527-468aaa6629b7"}});

  /**
   * 住院管理
   * ---------------------------
   * */
  $scope.inhospitalportal = {

    id: "inhospital",

    name: "住院管理",

    server: "/api/v2/inhospitalrecords",

    defilters: {inHospitalNo: "住院号", gestCode: "会员编号", gestName: "会员姓名", petName: "宠物姓名"},

    callback: {
      update: function () {
        $scope.petportal.unique($scope.inhospital.petId);

        $scope.vipportal.unique($scope.inhospital.gestId);

        // $scope.inhospitalportal.searchAll();
        // $scope.inhospitaldetailportal.searchAll();

        $scope.vipprepayportal.search();

        $scope.inhospitalprescriptionportal.search();

        $scope.vipprepayportal.search();
      },

      unique: function () {
        $scope.inhospitalportal.filter();
      },

      view: function () {

        $scope.petportal.unique($scope.inhospital.petId);

        $scope.vipportal.unique($scope.inhospital.gestId);

        // $scope.inhospitalportal.searchAll();
        // $scope.inhospitaldetailportal.searchAll();

        $scope.vipprepayportal.search();

        $scope.inhospitalprescriptionportal.search();

        $scope.vipprepayportal.search();
      },
      insert: function () {
        $scope.pet = {};

        $scope.vip = {};

        $scope.inhospitaldetails = [];

        $scope.inhospitalprescriptions = [];

        $scope.inhospitalprescriptiondetails = [];

        $scope.inhospital.totalMoney = 0;

        $scope.serialNumber({id: "inhospital", fieldName: "inHospitalNo", numberName: "住院编号"});

        $scope.setSelectDefault("inhospital", ["itemCode", "managerId", "manufacturerId"]);
      },
      submitbefore: function () {

        delete $scope.inhospital.inputMoney;

        // if($scope.inhospital.itemCode)
        // {
        //     $scope.inhospital.itemName = $scope.dropdowns.itemCodeSet.findObjectWithProperty("itemCode", $scope.inhospital.itemCode).itemName;
        // }

        if ($scope.inhospital.managerId) {
          $scope.inhospital.managerBy = $scope.dropdowns.managerIdSet.getObjectWithId({id: $scope.inhospital.managerId}).personName;
        }

        if ($scope.inhospital.manufacturerId) {
          $scope.inhospital.manufacturerName = $scope.dropdowns.manufacturerIdSet.getObjectWithId({id: $scope.inhospital.manufacturerId}).personName;
        }

        delete $scope.inhospital.totalCount;
      },
      submit: function () {
        // 遍历保存所有子项
        angular.forEach($scope.inhospitaldetails, function (_inhospitaldetail) {
          // 寄养ID
          _inhospitaldetail.inHospitalId = $scope.inhospital.id;

          // 寄养编号
          _inhospitaldetail.inHospitalNo = $scope.inhospital.inHospitalNo;

          $scope.inhospitaldetailportal.saveWithEntity(_inhospitaldetail);
        });

        $scope.inhospitalportal.filter();
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.inhospitalportal}); //继承

  // 出院
  $scope.inhospitalportal.outhospital = function () {
    if ($scope.inhospital.inputMoney ==  undefined){
      $scope.inhospital.inputMoney = 0;
    }

    if ($scope.inhospital.inputMoney === 0) {
      $http.get(commons.getBusinessHostname() + $scope.inhospitalportal.server + "/over/" + $scope.inhospital.inHospitalNo).success(function (data, status, headers, config) {
        $('#' + $scope.inhospitalportal.id).modal('hide');
        $scope.inhospitalportal.filter();
        commons.success("出院成功");
      });
    }
    else if($scope.inhospital.inputMoney && $scope.inhospital.inputMoney > 0)
    {
      commons.modaldanger($scope.inhospitalportal.id, "清零后再出院");
    }
    else if($scope.inhospital.inputMoney && $scope.inhospital.inputMoney < 0){
      commons.modaldanger($scope.inhospitalportal.id, "通过押金补齐");
    }
  };

  // /**
  //  * 寄养期间消费
  //  * ---------------------------
  //  * */
  // $scope.inhospitaldetailportal = {
  //
  //     foreign: "inhospital", // 外键
  //
  //     foreignkey: "inHospitalId", // 外键
  //
  //     id: "inhospitaldetail",
  //
  //     name: "寄养期间消费",
  //
  //     server: "/api/v2/inhospitalrecorddetails",
  //
  //     defilters: { },
  //
  //     callback: {
  //         search: function(){
  //             $scope.inhospitaldetailportal.resize();
  //         }
  //     }
  // };
  //
  // $controller('BaseCRUDController', {$scope: $scope, component: $scope.inhospitaldetailportal}); //继承

  /**
   * 预付金额
   * ---------------------------
   * */
  $scope.vipprepayportal = {

    foreign: "inhospital", // 外键

    foreignkey: "relationId", // 外键

    id: "vipprepay",

    name: "预付金额",

    server: "/api/v2/prepaymoneys",

    defilters: {},

    callback: {
      submit: function () {
        $scope.inhospitalportal.unique($scope.inhospital.id);
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.vipprepayportal}); //继承

  /**
   * 健康状态记录
   * ---------------------------
   * */
  $scope.inhospitalhealthportal = {

    foreign: "inhospital", // 外键

    foreignkey: "relationId", // 外键

    id: "inhospitalhealth",

    name: "健康状态记录",

    server: "/api/v2/inhospitalhealths",

    defilters: {},

    callback: {}
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.inhospitalhealthportal}); //继承

  /**
   * 住院处方
   * ---------------------------
   * */
  $scope.inhospitalprescriptionportal = {

    id: "inhospitalprescription",

    name: "住院处方",

    server: "/api/v2/inhospitalprescriptions",

    callback: {
      submitbefore: function () {

        $scope.inhospitalprescription.inHospitalNo = $scope.inhospital.inHospitalNo;

        $scope.inhospitalprescription.inHospitalId = $scope.inhospital.id;

        // 病例号
        $scope.inhospitalprescription.sickFileCode = $scope.inhospital.id;

        $scope.inhospitalprescription.gestName = $scope.inhospital.gestName;

        $scope.inhospitalprescription.petName = $scope.inhospital.petName;
      },

      submit: function () {
        angular.forEach($scope.inhospitalprescriptiondetails, function (_inhospitalprescriptiondetail) {

          _inhospitalprescriptiondetail.prescriptionId = $scope.inhospitalprescription.id;

          $scope.inhospitalprescriptiondetailportal.saveWithEntity(_inhospitalprescriptiondetail);
        });

        $scope.inhospitalprescriptiondetail = {};
      },

      delete: function () {
        $scope.inhospitalprescriptiondetails = [];
      },

      switched: function () {
         $scope.inhospitalprescriptiondetailportal.search();
      }
    }
  };

  $controller('SidePanelController', {$scope: $scope, component: $scope.inhospitalprescriptionportal}); //继承


  /**
   * 查询
   * ---------------------------
   * */
  $scope.inhospitalprescriptionportal.search = function () {

    $http.post(commons.getBusinessHostname() + $scope.inhospitalprescriptionportal.server + "/page" + commons.getTimestampStr(), {
      'pageSize': 10000,
      'pageNumber': '1',
      'filters': [{"fieldName": "inHospitalNo", "operator": "EQ", "value": $scope.inhospital.inHospitalNo}]
    }).success(function (data, status, headers, config) {
      $scope.inhospitalprescriptions = data.data.content;

      if ($scope.inhospitalprescriptions.length > 0) {
        $scope.inhospitalprescriptionportal.switched($scope.inhospitalprescriptions[0].id);

        if (!!$scope.inhospitalprescriptionportal.callback && !!$scope.inhospitalprescriptionportal.callback.search) {
          $scope.inhospitalprescriptionportal.callback.search();
        }
      }
    });
  };
  /**
   * 复制处方单
   * ---------------------------
   * */
  $scope.inhospitalprescriptionportal.clonedoctorprescript = function () {
    $http.get(commons.getBusinessHostname() + $scope.inhospitalprescriptionportal.server + "/copy/" + $scope.inhospitalprescription.prescriptionCode + "?inHospitalRecordCode=" + $scope.inhospital.inHospitalNo).success(function (data, status, headers, config) {
      $scope.inhospitalprescriptionportal.switched();
    });
  };

  $scope.inhospitalprescriptionportal.print = function () {

    $scope.nowtime = new Date();

    var $first = 18; // 首页行数

    var $middle = 24; // 中间页行数

    var $last = 24; // 最后页行数

    $scope.inhospitalprescriptiondetail2ds = [];

    var size = $scope.inhospitalprescriptiondetails.length;

    // 首页
    $scope.inhospitalprescriptiondetail2ds.push($scope.inhospitalprescriptiondetails.slice(0, size > $first ? $first : size));

    if (size > $first) {
      var $index = $first;

      var size = size - $first;

      // 中间页
      while (size > $middle) {
        $scope.inhospitalprescriptiondetail2ds.push($scope.inhospitalprescriptiondetails.slice($index, $index + $middle));

        $index = $index + $middle;

        size = size - $middle;
      }

      // 尾页
      if (size > 0) {
        $scope.inhospitalprescriptiondetail2ds.push($scope.inhospitalprescriptiondetails.slice($index));

        $scope.lastpagebreak = size > $last;
      }
      else {
        $scope.lastpagebreak = true;
      }
    }

    // $scope.pet.age = $scope.getAgeByBirthday($scope.pet.petBirthday);

    $('#inhospitalprescriptionprint').modal({backdrop: 'static', keyboard: false});
  };

  // 打印页面
  $scope.print = function () {

    $('#inhospitalprescriptionprintbody').find(':text').each(function(i, node){
      var _text = $(node);
      _text.parent().html(_text.val());
    });

    var html = '';

    $('#inhospitalprescriptionprintbody').find('.print-body-html').each(function(i, node){
      html += "<p></p>";
      html += node.outerHTML;
      html += "<p style='page-break-after:always;both: clean'>&nbsp;</p>";
    });

    document.getElementById('printiframe').contentWindow.document.getElementById('printBody').innerHTML = html;
    document.getElementById('printiframe').contentWindow.print();

    $('#inhospitalprescriptionprint').modal('hide');
  }

  /**
   * 住院处方明细
   * ---------------------------
   * */
  $scope.inhospitalprescriptiondetailportal = {

    foreign: "inhospitalprescription", // 外键

    foreignkey: "prescriptionId",

    id: "inhospitalprescriptiondetail",

    name: "住院处方明细",

    server: "/api/v2/inhospitalprescriptiondetails",

    callback: {
      delete: function(){

        // 重新计算
        $scope.rearith();
      }
    }
  };

  $controller('BaseCRUDController', {$scope: $scope, component: $scope.inhospitalprescriptiondetailportal}); //继承

  $scope.inhospitalprescriptiondetailportal.pagination.pageSize = 100000;

  $scope.inhospitalprescriptionportal.insert = function () {

    $scope.inhospitalprescriptionportal.selectedId = null;

    $scope.inhospitalprescription = {};
    $scope.inhospitalprescriptiondetails = [];

    $scope.serialNumber({id: "inhospitalprescription", fieldName: "prescriptionCode", numberName: "处方流水"});

    $("#inhospitalprescription").modal({backdrop: 'static', keyboard: false});
  };

  /**
   * 自动补全选择商品
   * ---------------------------
   * */
  $controller('ProductAutoCompleteController', {$scope: $scope}); //继承

  /**
   * 添加处方明细
   * ---------------------------
   * */
  $scope.productportal.checked = function (_selectObject) {

    var _products;

    if (_selectObject.dataType == 'template') {
      _products = commons.findTemplateDetails(_selectObject.templateNo);
    }
    else {
      _products = [_selectObject];
    }

    if (!$scope.inhospitalprescriptiondetails) {
      $scope.inhospitalprescriptiondetails = [];
    }

    angular.forEach(_products, function (_product) {

      var _inhospitalprescriptiondetail = {};

      //  "inputCount",

      angular.forEach(["itemCode", "itemName", "recipeUnit", "useWay"], function (name) {
        _inhospitalprescriptiondetail[name] = _product[name];
      });

      _inhospitalprescriptiondetail.manufacturerCode = _product.dealerCode;
      _inhospitalprescriptiondetail.manufacturerName = _product.dealerName;

      // 售价
      _inhospitalprescriptiondetail.itemCost = _product.recipePrice;

      // 个数
      _inhospitalprescriptiondetail.itemNum = _product.$itemNum || 1;

      delete _product.$itemNum;

      $scope.inhospitalprescriptiondetails.push(_inhospitalprescriptiondetail);

    });

//        if($scope.inhospitalprescriptiondetails.existprop('itemCode', _product.itemCode)) {   // 是否已选择
//            commons.modaldanger("inhospitalprescriptiondetails", "[ 商品" +_product.itemName+ " ]已存在");
//        }
//        else {
    // 未选择新添加

    // commons.modalsuccess("inhospitalprescription", "成功添加[ " +inhospitalprescriptiondetail.itemName+ " ]商品");
//        }

    $scope.rearith();
  };

  // 重新计算
  $scope.rearith = function () {

    $scope.inhospitalprescription.prescriptionCost = 0;

    angular.forEach($scope.inhospitalprescriptiondetails, function (_inhospitalprescriptiondetail) {
      // 小计
      var _totalCost = _inhospitalprescriptiondetail.itemCost * _inhospitalprescriptiondetail.itemNum;

      // 总金额
      $scope.inhospitalprescription.prescriptionCost += _totalCost;
    });
  };

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

  $scope.petportal.checked = function (_pet) {

    $scope.pet = _pet;

    // 会员ID
    $scope.inhospital.gestId = _pet.gestId;

    // 查询会员
    $scope.vipportal.unique(_pet.gestId);

    // 会员编号
    $scope.inhospital.gestCode = _pet.gestCode;

    // 会员姓名
    $scope.inhospital.gestName = _pet.gestName;

    // 会员手机
    $scope.inhospital.mobilePhone = "";

    // 宠物ID
    $scope.inhospital.petId = _pet.id;

    // 宠物名称
    $scope.inhospital.petName = _pet.petName;

    $("#petselect").modal('hide');
  };

  // 初始化查找商品
  $scope.productportal.autocompletetemplatedata();

  $scope.inhospitalportal.filter();

  // 查询医院信息
  $http.get(commons.getBusinessHostname() + "/api/v2/enterprises" + commons.getTimestampStr()).success(function (data, status, headers, config) {
    angular.forEach(data.data, function (item) {
      $scope.hospital = item;
    });
  });
});
