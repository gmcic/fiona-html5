// 宠物管理
angular.module('fiona').controller('AmchartController', function ($scope, $http, commons) {
  // 基于准备好的dom，初始化echarts图表
  var line = echarts.init(document.getElementById('line'));

  // 为echarts对象加载数据
  line.setOption({
    title: {
      text: '未来一周气温变化',
      subtext: '纯属虚构'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['最高气温', '最低气温']
    },
    toolbox: {
      show: true,
      feature: {
        mark: {show: true},
        dataView: {show: true, readOnly: false},
        magicType: {show: true, type: ['line', 'bar']},
        restore: {show: true},
        saveAsImage: {show: true}
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C'
        }
      }
    ],
    series: [
      {
        name: '最高气温',
        type: 'line',
        data: [11, 11, 15, 13, 12, 13, 10],
        markPoint: {
          data: [
            {type: 'max', name: '最大值'},
            {type: 'min', name: '最小值'}
          ]
        },
        markLine: {
          data: [
            {type: 'average', name: '平均值'}
          ]
        }
      },
      {
        name: '最低气温',
        type: 'line',
        data: [1, -2, 2, 5, 3, 2, 0],
        markPoint: {
          data: [
            {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
          ]
        },
        markLine: {
          data: [
            {type: 'average', name: '平均值'}
          ]
        }
      }
    ]
  });


  // 基于准备好的dom，初始化echarts图表
  var area = echarts.init(document.getElementById('area'));

  // 为echarts对象加载数据
  area.setOption({
    title : {
      text: '某楼盘销售情况',
      subtext: '纯属虚构'
    },
    tooltip : {
      trigger: 'axis'
    },
    legend: {
      data:['意向','预购','成交']
    },
    toolbox: {
      show : true,
      feature : {
        mark : {show: true},
        dataView : {show: true, readOnly: false},
        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        restore : {show: true},
        saveAsImage : {show: true}
      }
    },
    calculable : true,
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : ['周一','周二','周三','周四','周五','周六','周日']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name:'成交',
        type:'line',
        smooth:true,
        itemStyle: {normal: {areaStyle: {type: 'default'}}},
        data:[10, 12, 21, 54, 260, 830, 710]
      },
      {
        name:'预购',
        type:'line',
        smooth:true,
        itemStyle: {normal: {areaStyle: {type: 'default'}}},
        data:[30, 182, 434, 791, 390, 30, 10]
      },
      {
        name:'意向',
        type:'line',
        smooth:true,
        itemStyle: {normal: {areaStyle: {type: 'default'}}},
        data:[1320, 1132, 601, 234, 120, 90, 20]
      }
    ]
  });

  // 基于准备好的dom，初始化echarts图表
  var horizontalbar = echarts.init(document.getElementById('horizontalbar'));

  // 为echarts对象加载数据
  horizontalbar.setOption({
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data:['直接访问', '邮件营销','联盟广告','视频广告','搜索引擎']
    },
    toolbox: {
      show : true,
      feature : {
        mark : {show: true},
        dataView : {show: true, readOnly: false},
        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        restore : {show: true},
        saveAsImage : {show: true}
      }
    },
    calculable : true,
    xAxis : [
      {
        type : 'value'
      }
    ],
    yAxis : [
      {
        type : 'category',
        data : ['周一','周二','周三','周四','周五','周六','周日']
      }
    ],
    series : [
      {
        name:'直接访问',
        type:'bar',
        stack: '总量',
        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
        data:[320, 302, 301, 334, 390, 330, 320]
      },
      {
        name:'邮件营销',
        type:'bar',
        stack: '总量',
        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
        data:[120, 132, 101, 134, 90, 230, 210]
      },
      {
        name:'联盟广告',
        type:'bar',
        stack: '总量',
        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
        data:[220, 182, 191, 234, 290, 330, 310]
      },
      {
        name:'视频广告',
        type:'bar',
        stack: '总量',
        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
        data:[150, 212, 201, 154, 190, 330, 410]
      },
      {
        name:'搜索引擎',
        type:'bar',
        stack: '总量',
        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
        data:[820, 832, 901, 934, 1290, 1330, 1320]
      }
    ]
  });

  // 基于准备好的dom，初始化echarts图表
  var verticalbar = echarts.init(document.getElementById('verticalbar'));

  // 为echarts对象加载数据
  verticalbar.setOption({
    title: {
      x: 'center',
      text: 'ECharts例子个数统计',
      subtext: 'Rainbow bar example',
      link: 'http://echarts.baidu.com/doc/example.html'
    },
    tooltip: {
      trigger: 'item'
    },
    toolbox: {
      show: true,
      feature: {
        dataView: {show: true, readOnly: false},
        restore: {show: true},
        saveAsImage: {show: true}
      }
    },
    calculable: true,
    grid: {
      borderWidth: 0,
      y: 80,
      y2: 60
    },
    xAxis: [
      {
        type: 'category',
        show: false,
        data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
      }
    ],
    yAxis: [
      {
        type: 'value',
        show: false
      }
    ],
    series: [
      {
        name: 'ECharts例子个数统计',
        type: 'bar',
        itemStyle: {
          normal: {
            color: function(params) {
              // build a color map as your need.
              var colorList = [
                '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
              ];
              return colorList[params.dataIndex]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{b}\n{c}'
            }
          }
        },
        data: [12,21,10,4,12,5,6,5,25,23,7],
        markPoint: {
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0)',
            formatter: function(params){
              return '<img src="'
                + params.data.symbol.replace('image://', '')
                + '"/>';
            }
          },
          data: [
            {xAxis:0, y: 350, name:'Line', symbolSize:20, symbol: 'image://../asset/ico/折线图.png'},
            {xAxis:1, y: 350, name:'Bar', symbolSize:20, symbol: 'image://../asset/ico/柱状图.png'},
            {xAxis:2, y: 350, name:'Scatter', symbolSize:20, symbol: 'image://../asset/ico/散点图.png'},
            {xAxis:3, y: 350, name:'K', symbolSize:20, symbol: 'image://../asset/ico/K线图.png'},
            {xAxis:4, y: 350, name:'Pie', symbolSize:20, symbol: 'image://../asset/ico/饼状图.png'},
            {xAxis:5, y: 350, name:'Radar', symbolSize:20, symbol: 'image://../asset/ico/雷达图.png'},
            {xAxis:6, y: 350, name:'Chord', symbolSize:20, symbol: 'image://../asset/ico/和弦图.png'},
            {xAxis:7, y: 350, name:'Force', symbolSize:20, symbol: 'image://../asset/ico/力导向图.png'},
            {xAxis:8, y: 350, name:'Map', symbolSize:20, symbol: 'image://../asset/ico/地图.png'},
            {xAxis:9, y: 350, name:'Gauge', symbolSize:20, symbol: 'image://../asset/ico/仪表盘.png'},
            {xAxis:10, y: 350, name:'Funnel', symbolSize:20, symbol: 'image://../asset/ico/漏斗图.png'},
          ]
        }
      }
    ]
  });


  // 基于准备好的dom，初始化echarts图表
  var pie = echarts.init(document.getElementById('pie'));

  // 为echarts对象加载数据
  pie.setOption({
    title : {
      text: '某站点用户访问来源',
      subtext: '纯属虚构',
      x:'center'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient : 'vertical',
      x : 'left',
      data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    toolbox: {
      show : true,
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
        name:'访问来源',
        type:'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[
          {value:335, name:'直接访问'},
          {value:310, name:'邮件营销'},
          {value:234, name:'联盟广告'},
          {value:135, name:'视频广告'},
          {value:1548, name:'搜索引擎'}
        ]
      }
    ]
  });

  // 基于准备好的dom，初始化echarts图表
  var ring = echarts.init(document.getElementById('ring'));

  // 为echarts对象加载数据
  ring.setOption( {
    title : {
      text: '南丁格尔玫瑰图',
      subtext: '纯属虚构',
      x:'center'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      x : 'center',
      y : 'bottom',
      data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
    },
    toolbox: {
      show : true,
      feature : {
        mark : {show: true},
        dataView : {show: true, readOnly: false},
        magicType : {
          show: true,
          type: ['pie', 'funnel']
        },
        restore : {show: true},
        saveAsImage : {show: true}
      }
    },
    calculable : true,
    series : [
      {
        name:'半径模式',
        type:'pie',
        radius : [20, 110],
        center : ['25%', 200],
        roseType : 'radius',
        width: '40%',       // for funnel
        max: 40,            // for funnel
        itemStyle : {
          normal : {
            label : {
              show : false
            },
            labelLine : {
              show : false
            }
          },
          emphasis : {
            label : {
              show : true
            },
            labelLine : {
              show : true
            }
          }
        },
        data:[
          {value:10, name:'rose1'},
          {value:5, name:'rose2'},
          {value:15, name:'rose3'},
          {value:25, name:'rose4'},
          {value:20, name:'rose5'},
          {value:35, name:'rose6'},
          {value:30, name:'rose7'},
          {value:40, name:'rose8'}
        ]
      },
      {
        name:'面积模式',
        type:'pie',
        radius : [30, 110],
        center : ['75%', 200],
        roseType : 'area',
        x: '50%',               // for funnel
        max: 40,                // for funnel
        sort : 'ascending',     // for funnel
        data:[
          {value:10, name:'rose1'},
          {value:5, name:'rose2'},
          {value:15, name:'rose3'},
          {value:25, name:'rose4'},
          {value:20, name:'rose5'},
          {value:35, name:'rose6'},
          {value:30, name:'rose7'},
          {value:40, name:'rose8'}
        ]
      }
    ]
  });


  // 基于准备好的dom，初始化echarts图表
  var funnel = echarts.init(document.getElementById('funnel'));

  // 为echarts对象加载数据
  funnel.setOption({
    title : {
      text: '漏斗图',
      subtext: '纯属虚构'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
      show : true,
      feature : {
        mark : {show: true},
        dataView : {show: true, readOnly: false},
        restore : {show: true},
        saveAsImage : {show: true}
      }
    },
    legend: {
      data : ['展现','点击','访问','咨询','订单']
    },
    calculable : true,
    series : [
      {
        name:'漏斗图',
        type:'funnel',
        width: '40%',
        data:[
          {value:60, name:'访问'},
          {value:40, name:'咨询'},
          {value:20, name:'订单'},
          {value:80, name:'点击'},
          {value:100, name:'展现'}
        ]
      },
      {
        name:'金字塔',
        type:'funnel',
        x : '50%',
        sort : 'ascending',
        itemStyle: {
          normal: {
            // color: 各异,
            label: {
              position: 'left'
            }
          }
        },
        data:[
          {value:60, name:'访问'},
          {value:40, name:'咨询'},
          {value:20, name:'订单'},
          {value:80, name:'点击'},
          {value:100, name:'展现'}
        ]
      }
    ]
  });

  // 基于准备好的dom，初始化echarts图表
  var funnel1 = echarts.init(document.getElementById('funnel1'));

  // 为echarts对象加载数据
  funnel1.setOption( {
    color : [
      'rgba(255, 69, 0, 0.5)',
      'rgba(255, 150, 0, 0.5)',
      'rgba(255, 200, 0, 0.5)',
      'rgba(155, 200, 50, 0.5)',
      'rgba(55, 200, 100, 0.5)'
    ],
    title : {
      text: '漏斗图',
      subtext: '纯属虚构'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
      show : true,
      feature : {
        mark : {show: true},
        dataView : {show: true, readOnly: false},
        restore : {show: true},
        saveAsImage : {show: true}
      }
    },
    legend: {
      data : ['展现','点击','访问','咨询','订单']
    },
    calculable : true,
    series : [
      {
        name:'预期',
        type:'funnel',
        x: '10%',
        width: '80%',
        itemStyle: {
          normal: {
            label: {
              formatter: '{b}预期'
            },
            labelLine: {
              show : false
            }
          },
          emphasis: {
            label: {
              position:'inside',
              formatter: '{b}预期 : {c}%'
            }
          }
        },
        data:[
          {value:60, name:'访问'},
          {value:40, name:'咨询'},
          {value:20, name:'订单'},
          {value:80, name:'点击'},
          {value:100, name:'展现'}
        ]
      },
      {
        name:'实际',
        type:'funnel',
        x: '10%',
        width: '80%',
        maxSize: '80%',
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 2,
            label: {
              position: 'inside',
              formatter: '{c}%',
              textStyle: {
                color: '#fff'
              }
            }
          },
          emphasis: {
            label: {
              position:'inside',
              formatter: '{b}实际 : {c}%'
            }
          }
        },
        data:[
          {value:30, name:'访问'},
          {value:10, name:'咨询'},
          {value:5, name:'订单'},
          {value:50, name:'点击'},
          {value:80, name:'展现'}
        ]
      }
    ]
  });


  // 基于准备好的dom，初始化echarts图表
  var map = echarts.init(document.getElementById('map'));

  // 为echarts对象加载数据
  map.setOption( {
    title : {
      text: 'World Population (2010)',
      subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
      sublink : 'http://esa.un.org/wpp/Excel-Data/population.htm',
      x:'center',
      y:'top'
    },
    tooltip : {
      trigger: 'item',
      formatter : function (params) {
        var value = (params.value + '').split('.');
        value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
          + '.' + value[1];
        return params.seriesName + '<br/>' + params.name + ' : ' + value;
      }
    },
    toolbox: {
      show : true,
      orient : 'vertical',
      x: 'right',
      y: 'center',
      feature : {
        mark : {show: true},
        dataView : {show: true, readOnly: false},
        restore : {show: true},
        saveAsImage : {show: true}
      }
    },
    dataRange: {
      min: 0,
      max: 1000000,
      text:['High','Low'],
      realtime: false,
      calculable : true,
      color: ['orangered','yellow','lightskyblue']
    },
    series : [
      {
        name: 'World Population (2010)',
        type: 'map',
        mapType: 'world',
        roam: true,
        mapLocation: {
          y : 60
        },
        itemStyle:{
          emphasis:{label:{show:true}}
        },
        data:[
          {name : 'Afghanistan', value : 28397.812},
          {name : 'Angola', value : 19549.124},
          {name : 'Albania', value : 3150.143},
          {name : 'United Arab Emirates', value : 8441.537},
          {name : 'Argentina', value : 40374.224},
          {name : 'Armenia', value : 2963.496},
          {name : 'French Southern and Antarctic Lands', value : 268.065},
          {name : 'Australia', value : 22404.488},
          {name : 'Austria', value : 8401.924},
          {name : 'Azerbaijan', value : 9094.718},
          {name : 'Burundi', value : 9232.753},
          {name : 'Belgium', value : 10941.288},
          {name : 'Benin', value : 9509.798},
          {name : 'Burkina Faso', value : 15540.284},
          {name : 'Bangladesh', value : 151125.475},
          {name : 'Bulgaria', value : 7389.175},
          {name : 'The Bahamas', value : 66402.316},
          {name : 'Bosnia and Herzegovina', value : 3845.929},
          {name : 'Belarus', value : 9491.07},
          {name : 'Belize', value : 308.595},
          {name : 'Bermuda', value : 64.951},
          {name : 'Bolivia', value : 716.939},
          {name : 'Brazil', value : 195210.154},
          {name : 'Brunei', value : 27.223},
          {name : 'Bhutan', value : 716.939},
          {name : 'Botswana', value : 1969.341},
          {name : 'Central African Republic', value : 4349.921},
          {name : 'Canada', value : 34126.24},
          {name : 'Switzerland', value : 7830.534},
          {name : 'Chile', value : 17150.76},
          {name : 'China', value : 1359821.465},
          {name : 'Ivory Coast', value : 60508.978},
          {name : 'Cameroon', value : 20624.343},
          {name : 'Democratic Republic of the Congo', value : 62191.161},
          {name : 'Republic of the Congo', value : 3573.024},
          {name : 'Colombia', value : 46444.798},
          {name : 'Costa Rica', value : 4669.685},
          {name : 'Cuba', value : 11281.768},
          {name : 'Northern Cyprus', value : 1.468},
          {name : 'Cyprus', value : 1103.685},
          {name : 'Czech Republic', value : 10553.701},
          {name : 'Germany', value : 83017.404},
          {name : 'Djibouti', value : 834.036},
          {name : 'Denmark', value : 5550.959},
          {name : 'Dominican Republic', value : 10016.797},
          {name : 'Algeria', value : 37062.82},
          {name : 'Ecuador', value : 15001.072},
          {name : 'Egypt', value : 78075.705},
          {name : 'Eritrea', value : 5741.159},
          {name : 'Spain', value : 46182.038},
          {name : 'Estonia', value : 1298.533},
          {name : 'Ethiopia', value : 87095.281},
          {name : 'Finland', value : 5367.693},
          {name : 'Fiji', value : 860.559},
          {name : 'Falkland Islands', value : 49.581},
          {name : 'France', value : 63230.866},
          {name : 'Gabon', value : 1556.222},
          {name : 'United Kingdom', value : 62066.35},
          {name : 'Georgia', value : 4388.674},
          {name : 'Ghana', value : 24262.901},
          {name : 'Guinea', value : 10876.033},
          {name : 'Gambia', value : 1680.64},
          {name : 'Guinea Bissau', value : 10876.033},
          {name : 'Equatorial Guinea', value : 696.167},
          {name : 'Greece', value : 11109.999},
          {name : 'Greenland', value : 56.546},
          {name : 'Guatemala', value : 14341.576},
          {name : 'French Guiana', value : 231.169},
          {name : 'Guyana', value : 786.126},
          {name : 'Honduras', value : 7621.204},
          {name : 'Croatia', value : 4338.027},
          {name : 'Haiti', value : 9896.4},
          {name : 'Hungary', value : 10014.633},
          {name : 'Indonesia', value : 240676.485},
          {name : 'India', value : 1205624.648},
          {name : 'Ireland', value : 4467.561},
          {name : 'Iran', value : 240676.485},
          {name : 'Iraq', value : 30962.38},
          {name : 'Iceland', value : 318.042},
          {name : 'Israel', value : 7420.368},
          {name : 'Italy', value : 60508.978},
          {name : 'Jamaica', value : 2741.485},
          {name : 'Jordan', value : 6454.554},
          {name : 'Japan', value : 127352.833},
          {name : 'Kazakhstan', value : 15921.127},
          {name : 'Kenya', value : 40909.194},
          {name : 'Kyrgyzstan', value : 5334.223},
          {name : 'Cambodia', value : 14364.931},
          {name : 'South Korea', value : 51452.352},
          {name : 'Kosovo', value : 97.743},
          {name : 'Kuwait', value : 2991.58},
          {name : 'Laos', value : 6395.713},
          {name : 'Lebanon', value : 4341.092},
          {name : 'Liberia', value : 3957.99},
          {name : 'Libya', value : 6040.612},
          {name : 'Sri Lanka', value : 20758.779},
          {name : 'Lesotho', value : 2008.921},
          {name : 'Lithuania', value : 3068.457},
          {name : 'Luxembourg', value : 507.885},
          {name : 'Latvia', value : 2090.519},
          {name : 'Morocco', value : 31642.36},
          {name : 'Moldova', value : 103.619},
          {name : 'Madagascar', value : 21079.532},
          {name : 'Mexico', value : 117886.404},
          {name : 'Macedonia', value : 507.885},
          {name : 'Mali', value : 13985.961},
          {name : 'Myanmar', value : 51931.231},
          {name : 'Montenegro', value : 620.078},
          {name : 'Mongolia', value : 2712.738},
          {name : 'Mozambique', value : 23967.265},
          {name : 'Mauritania', value : 3609.42},
          {name : 'Malawi', value : 15013.694},
          {name : 'Malaysia', value : 28275.835},
          {name : 'Namibia', value : 2178.967},
          {name : 'New Caledonia', value : 246.379},
          {name : 'Niger', value : 15893.746},
          {name : 'Nigeria', value : 159707.78},
          {name : 'Nicaragua', value : 5822.209},
          {name : 'Netherlands', value : 16615.243},
          {name : 'Norway', value : 4891.251},
          {name : 'Nepal', value : 26846.016},
          {name : 'New Zealand', value : 4368.136},
          {name : 'Oman', value : 2802.768},
          {name : 'Pakistan', value : 173149.306},
          {name : 'Panama', value : 3678.128},
          {name : 'Peru', value : 29262.83},
          {name : 'Philippines', value : 93444.322},
          {name : 'Papua New Guinea', value : 6858.945},
          {name : 'Poland', value : 38198.754},
          {name : 'Puerto Rico', value : 3709.671},
          {name : 'North Korea', value : 1.468},
          {name : 'Portugal', value : 10589.792},
          {name : 'Paraguay', value : 6459.721},
          {name : 'Qatar', value : 1749.713},
          {name : 'Romania', value : 21861.476},
          {name : 'Russia', value : 21861.476},
          {name : 'Rwanda', value : 10836.732},
          {name : 'Western Sahara', value : 514.648},
          {name : 'Saudi Arabia', value : 27258.387},
          {name : 'Sudan', value : 35652.002},
          {name : 'South Sudan', value : 9940.929},
          {name : 'Senegal', value : 12950.564},
          {name : 'Solomon Islands', value : 526.447},
          {name : 'Sierra Leone', value : 5751.976},
          {name : 'El Salvador', value : 6218.195},
          {name : 'Somaliland', value : 9636.173},
          {name : 'Somalia', value : 9636.173},
          {name : 'Republic of Serbia', value : 3573.024},
          {name : 'Suriname', value : 524.96},
          {name : 'Slovakia', value : 5433.437},
          {name : 'Slovenia', value : 2054.232},
          {name : 'Sweden', value : 9382.297},
          {name : 'Swaziland', value : 1193.148},
          {name : 'Syria', value : 7830.534},
          {name : 'Chad', value : 11720.781},
          {name : 'Togo', value : 6306.014},
          {name : 'Thailand', value : 66402.316},
          {name : 'Tajikistan', value : 7627.326},
          {name : 'Turkmenistan', value : 5041.995},
          {name : 'East Timor', value : 10016.797},
          {name : 'Trinidad and Tobago', value : 1328.095},
          {name : 'Tunisia', value : 10631.83},
          {name : 'Turkey', value : 72137.546},
          {name : 'United Republic of Tanzania', value : 44973.33},
          {name : 'Uganda', value : 33987.213},
          {name : 'Ukraine', value : 46050.22},
          {name : 'Uruguay', value : 3371.982},
          {name : 'United States of America', value : 312247.116},
          {name : 'Uzbekistan', value : 27769.27},
          {name : 'Venezuela', value : 236.299},
          {name : 'Vietnam', value : 89047.397},
          {name : 'Vanuatu', value : 236.299},
          {name : 'West Bank', value : 13.565},
          {name : 'Yemen', value : 22763.008},
          {name : 'South Africa', value : 51452.352},
          {name : 'Zambia', value : 13216.985},
          {name : 'Zimbabwe', value : 13076.978}
        ]
      }
    ]
  })
});