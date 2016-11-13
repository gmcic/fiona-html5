# Fiona

## BUG List

1. 服务商品分类 - 修改 - 保存失败

测试提示

# TODO

1. 入库管理 -> 审核 —> 返回审核后的对象,不要返回 true, false


# ERROR

## /gestpaidrecords/bullList

> 缺少ID, 值为用户ID

## 基础数据 - 宠物品种管理 - 种类 - 修改失败
 
 > 状态为 null
 
## 基础数据 - 宠物品种管理 - 品种 - 修改失败
 
 > 状态为 null
 
## 基础数据 - 员工管理 - 修改失败
 
 > constraint [login_name]; nested exception is org.hibernate.exception.ConstraintViolationException: could not execute statement
 

## 化验项目 - 化验项目分类
 
>  保存成功,数据没有更新


## 就诊管理
 
>  查询就诊信息失败

## 商品与分类 - 分类历史数据 - 不能保存
 
>  查询出的状态为 null


# /gestpaidrecords/billDetail

> 接口缺少字段说明

## tom

### BUG
#### 处方
1. 处方药品删除串位
1. 删除药品重新添加提示药品已经存在
1. 药品添加一定数量后,药品无法添加,页面显示不下

#### 基础数据
1. 用户字典管理页面为显示


### 改进需求
#### 处方
1. 选药的结果和选药的备选页面在一起方便查看显示结果
1. 大夫在电脑上添加的时候显示备注，打印出来的时候没有
1. 稳定性上




