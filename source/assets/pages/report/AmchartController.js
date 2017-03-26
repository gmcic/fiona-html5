// 宠物管理
angular.module('fiona').directive('repeatFinish',function(){
  return {
    link: function(scope,element,attr){
      if(scope.$last == true){


        var table = $('#sample_2');

        table.dataTable({
          "ordering": false,
          searching:false,
          language: {
            aria: {
              sortAscending: ": activate to sort column ascending",
              sortDescending: ": activate to sort column descending"
            },
            emptyTable: "无记录",
            info: "显示 _START_ 到 _END_ 总 _TOTAL_ 记录",
            infoEmpty: "没有找到记录",
            infoFiltered: "(从 _MAX_ 条记录过滤)",
            lengthMenu: "每页 _MENU_ 条记录",
            search: "搜索:",
            zeroRecords: "未找到匹配记录",
            paginate: {
              previous: "上一页",
              next: "下一页",
              last: "尾页",
              first: "首页"
            }
          },
          bStateSave: !0,
          columnDefs: [{
            targets: 0,
            orderable: !1,
            searchable: !1
          }],
          lengthMenu: [[5, 15, 20, -1], [5, 15, 20, "All"]],
          pageLength: 5,
          pagingType: "bootstrap_full_number",
          columnDefs: [{
            orderable: !1,
            targets: [0]
          },
            {
              searchable: !1,
              targets: [0]
            }],
          order: [[1, "asc"]]
        });


      }
    }
  }
}).controller('AmchartController', function ($scope, $http, commons) {
  $http.get(commons.getBusinessHostname() + "/api/v2/reports/item").success(function (data, status, headers, config) {
    $scope.items = data.data;
  });

  // 查询模板明细
  $http.get(commons.getBusinessHostname() + "/api/v2/reports/person").success(function (data, status, headers, config) {
    $scope.legend = [];
    $scope.data = [];
    // 遍历保存所有子项
    angular.forEach(data.data, function (item) {
      console.log(item);
      var name = item.name + "(" + item.type + ")" + "[" + item.total + "]";

      $scope.legend[$scope.legend.length] = name;
      $scope.data[$scope.data.length] = {value:item.total, name:name};
    });

    // 基于准备好的dom，初始化echarts图表
    var pie = echarts.init(document.getElementById('pie'));

    // 为echarts对象加载数据
    pie.setOption({
      title : {
        text: '销售统计',
        subtext: '月销售',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient : 'vertical',
        x : 'left',
        data:$scope.legend
      },
      toolbox: {
        show : false,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType : {
            show: true,
            type: ['pie', 'funnel'],
            option: {
              funnel: {
                x: '25%',
                width: '50%',
                funnelAlign: 'left',
                max: 1548
              }
            }
          },
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      calculable : true,
      series : [
        {
          name:'销量统计',
          type:'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:$scope.data
        }
      ]
    });
  });


});