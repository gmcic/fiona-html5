angular.module('fiona.services', [])
.filter("dropdown", function () {
    return function (name, comboxs) {

        var value = "";

        if (name == true || name == value || !!name) {
            angular.forEach(comboxs, function (combox) {
                if(combox.id == name || combox.dictDetailCode == name)
                {
                    value = combox.valueNameCn;
                }
            });
        }

        return value;
    };
}).factory('commons', function() {
    return {
        setAuthorization: function (auth) {
            // console.log( "保存用户凭证" + auth );

            authorization = auth;
        },
        serialNumber: function () {
            var date = new Date();

            // date.getMilliseconds();

            return date.getFullYear() + "" + formatnumber(date.getMonth() + 1) + "" + formatnumber(date.getDate()) + "" + formatnumber(date.getHours()) + "" + formatnumber(date.getMinutes()) + "" + formatnumber(date.getSeconds());
        },
        getAuthorization : function () {
            // console.log( "当前用户凭证: " + authorization );
//            return  'fc5db3b3-4063-4a12-a511-880ba19e4b58';
            return sessionStorage.getItem("authorization");
        },
        getOrganize : function () {
            return sessionStorage.getItem("organize");
        },

        getTimestampStr: function () {
          return "?_timestamp=" + new Date().getTime();
        },

        getBusinessHostname : function () {
            console.log('getBusinessHostname', this.getOrganize());
            if ('lf' === this.getOrganize()){
                return "http://localhost:8080/lf/business";
            }else{
                return "http://localhost:8080/business";
            }    
            // return "http://localhost:8080/business";
        },
        getAccountHostname : function () {
           return "http://localhost:8080/account";
            // return "http://localhost:8080/account";
        },
        modaldanger: function (alert_id, msg) {
            App.alert({
                container: "#" + alert_id + "_alert",
                place: "append",
                type: "danger",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "remove"
            });

          return $('.modal').scrollTop(0);
        },
        modalsuccess: function (alert_id, msg) {
            App.alert({
                container: "#" + alert_id + "_alert",
                place: "append",
                type: "success",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "remove"
            });
        },
        success: function (msg) {
            App.alert({
                container: "#operate_msg_box",
                place: "append",
                type: "success",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "check"
            });
        },
        danger: function (msg) {
            App.alert({
                container: "#operate_msg_box",
                place: "append",
                type: "danger",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "remove"
            });
        },
        warning: function (msg) {
            App.alert({
                container: "#operate_msg_box",
                place: "append",
                type: "warning",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "warning"
            });
        },
        info: function (msg) {
            App.alert({
                container: "#operate_msg_box",
                place: "append",
                type: "info",
                message: msg,
                close: true,
                closeInSeconds: 2,
                icon: "info"
            });
        },

        dropdowns: {onoff:[{id: "是", valueNameCn: "是"}, {id: "否", valueNameCn: "否"}], onoffWithBoolean: [{id: false, valueNameCn: "否"}, {id: true, valueNameCn: "是"}]},

        db: null,

        getLocalDB: function(){
           if(!this.db)
           {
              this.db = new localdb("fiona");
           }

           return this.db;
        },

        getLocalTable: function(tableName){
            return this.getLocalDB().find(tableName);
        },

        findTemplateDetails : function (templateNo) {

            var _db = this.getLocalDB();

            var details = [];

            var products = _db.find('product');

            angular.forEach(_db.find("templatedetails")[templateNo], function (_detail) {

                var _product = products.findObjectWithProperty('itemCode', _detail.itemCode);

                if (_product){
                  _product.$itemNum = _detail.itemNum;
                }

                details.push(_product);
            });

            return details;
        },

        findDict: function(dropdowns, keys){

            var _db = this.getLocalDB();

            var _dict = _db.find("dict");

            angular.forEach(keys, function(_name, _key){

                if(_name == '用户等级')
                {
                    dropdowns[_key] = _db.find('grade');
                }
                else if(_name == '宠物种类')
                {
                    dropdowns[_key] = _db.find('varietietype');
                }
                else if(_name == '宠物品种')
                {
                    dropdowns[_key] = _db.find('varietie');
                }
                else if(_name == '主治医生' || _name == '助理医师' || _name == '服务助理' || _name == '服务师' || _name == '主管人员' || _name == '业务员')
                {
                    dropdowns[_key] = _db.find('persons');
                }
                else
                {
                    dropdowns[_key] = _dict[_name];
                }
            });

//            console.log(dropdowns);
        },

        loadDB : function($http) {

            var _db = this.getLocalDB();
            var baseURL = "http://localhost:8080/business/api/v2/";

            if ('lf' === this.getOrganize()){
                baseURL = "http://localhost:8080/lf/business/api/v2/";
            }
           
            // var baseURL = "http://localhost:8080/business/api/v2/";

            // 重新创建表
            angular.forEach(["dicttypedetails", "userdictdetails", 'itemcates', 'itemtypes'], function(name){
                if(!_db.tableExists(name))
                {
                    _db.createTable(name);// Create Table
                }
                else
                {
                    _db.dropTable(name);// Drop Table
                }
            });

            // 数据字典, 用户字典
            var dict = {
                "厂家类型": [{id: "1", valueNameCn: "经销商"}, {id: "2", valueNameCn: "生产商"}, {id: "3", valueNameCn: "经销商和生产商"}],

                onoff:[{id: "是", valueNameCn: "是"}, {id: "否", valueNameCn: "否"}],

                onoffWithBoolean: [{id: false, valueNameCn: "否"}, {id: true, valueNameCn: "是"}]
             };

            angular.forEach([{id: "dicttypedetails", moduleName: "字典", type: 'dicttypes', typeName: '字典分类', foreign: "dictTypeId"}, {id: "userdictdetails", moduleName: "用户字典", type: 'userdicts', typeName: '用户字典分类', foreign: "dictTypeId"}], function(obj){
                // 分类
                $http.get(baseURL + obj.type).success(function (datatypes, status, headers, config) {

                    var index = {};

                    angular.forEach(datatypes.data, function(dataType){
                       dict[dataType.dictName] = [];
                       index[dataType.id] = dataType.dictName;
                    });

                    $http.get(baseURL + obj.id).success(function (data, status, headers, config) {

                        angular.forEach(data.data, function(value){
                            var key = index[value[obj.foreign]];

                            dict[key].push(value);
                        });

                    });
                });

            });

//            console.log("数据字典");
//            console.log(dict);
            _db.insert("dict", dict);

            // 缓存商品

            // 缓存商品分类
            $http.get(baseURL + "itemcates").success(function (data, status, headers, config) {

//                console.log("商品与服务分类");
//                console.log(data.data);

                _db.insert("producttype", data.data);
            });

            // 缓存商品明细
            $http.get(baseURL + "itemtypes").success(function (data, status, headers, config) {

//                console.log("商品信息");
//                console.log(data.data);

                _db.insert("product", data.data);
            });

          // 缓存用户等级
          $http.get(baseURL + "gestlevels").success(function (data, status, headers, config) {
            _db.insert("grade", data.data);
          });

          // 缓存种类
          $http.get(baseURL + "petraces").success(function (data, status, headers, config) {
            _db.insert("varietietype", data.data);
          });

          // 缓存品种
          $http.get(baseURL + "varieties").success(function (data, status, headers, config) {
            _db.insert("varietie", data.data);
          });

          // 医生
          $http.get(baseURL + "personss").success(function (data, status, headers, config) {
            _db.insert("persons", data.data);
          });

          // 缓存处方模板
          $http.get(baseURL + "prescriptiontemplates").success(function (data, status, headers, config) {

            var templatedetail = {};

            angular.forEach(data.data, function (_template) {
              _template.dataType = 'template';

              _template.itemStyle = "处方模板";

              _template.itemName = _template.templateName;

              _template.inputCode = _template.barCode;

              templatedetail[_template.templateNo] = [];
            });

            // 查询模板明细
            $http.get(baseURL + "prescriptiontemplatedetails").success(function (data, status, headers, config) {
              angular.forEach(data.data, function (_detail) {

                if (templatedetail[_detail.templateNo])
                {
                  _detail.itemNum = parseInt(_detail.itemNum | 1);

                  templatedetail[_detail.templateNo].push(_detail);
                }
              });
            });

            _db.insert("templates", data.data);

            _db.insert("templatedetails", templatedetail);
          });
         }
    };
});
