// 导入模块
const express = require('express')
const dbHelper = require('./libs/dbHelper')
const path = require('path')

const bodyParser = require('body-parser')

const multer = require('multer')
var upload = multer({dest:'./views/imgs'})
// 实例化服务器对象
const app = express()
// 托管静态资源
app.use(express.static('views'))
//注册body-parser的中间件
app.use(bodyParser.urlencoded({ extended: false }))

// 路由1 英雄列表 带分页 带查询
app.get('/heroList', (req, res) => {
    // console.log(req.query);
    
  // 接收数据 页码
  const pagenum = parseInt(req.query.pagenum)
//   console.log(pagenum);
  // 接收数据 页容量
  const pagesize = parseInt(req.query.pagesize)
//   console.log(pagesize);
  // 接收数据 查询条件
  const query = req.query.query

  // 获取所有数据
  dbHelper.find('cqlist', {}, result => {
    // 检索出符合查询条件的数据
    // console.log(result);
    //倒序排列
    result = result.reverse()
    
    const temArr = result.filter(v => {
        
      if (v.heroName.indexOf(query) != -1 || v.skillName.indexOf(query) != -1) {
        return true 
      }
    })
    // 返回的数据
    let list = []
    // 计算起始索引
    const startIndex = (pagenum - 1) * pagesize
    // 计算结束索引
    const endIndex = startIndex + pagesize
    // 获取当前这一页的数据
    for (let i = startIndex; i < endIndex; i++) {
      if (temArr[i]) {
        list.push(temArr[i])
      }
    }
    // 获取总页数
    const totalPage = Math.ceil(temArr.length / pagesize)
    
    
    // 返回数据
    res.send({
      totalPage,
      list
    })
  })
})

// 路由2 英雄详情
app.get('/heroDetail',(req,res)=>{
  // 获取id
  const id = req.query.id
  // 根据id查询数据
  dbHelper.find('cqlist',{_id:dbHelper.ObjectId(id)},result=>{
    // 返回查询的数据
    res.send(result[0])
  })
})
//路由3： 英雄新增 文件上传
app.post('/heroAdd',upload.single('heroIcon'),(req,res)=>{
    const heroName = req.body.heroName
    const skillName = req.body.shillName
    //图片本地地址  托管静态资源的时候  views已经设置 访问时不需要
    const heroIcon = path.join('imgs',req.file.filename)

    //保存
    deHelper.insertOne(
        'cqlist',
        {
            heroName,
            heroIcon,
            skillName
        },
        result=>{
            res.send({
                code:200,
                msg:'添加成功'
            })
        }
    )
})
//路由4 英雄修改
app.post('/heroUpdate',upload.single('heroIcon'),(req,res)=>{
    const heroName = req.body.heroName
    const skillName = req.body.skillName 
    console.log(skillName);
    
    //图片本地地址  托管静态资源的时候  views已经设置 访问时不需要
    const heroIcon = path.join('imgs',req.file.filename)
    //还需要id
    const id = req.body.id

    let updateData = {
      heroName,
      skillName
    }
    //判断是否需要修改图片
    if (req.file) {
      const heroIcon = path.join('img',req.file.filename)
      //给updateData添加heroIcon
      updateData.heroIcon = heroIcon
    }

    //保存到数据库中
    dbHelper.updateOne(
        'cqlist',
        {_id:dbHelper.ObjectId(id)},
        updateData,
        result =>{
            res.send({
                code:200,
                msg:'修改成功'
            })
        }
    )
})
//路由5：删除英雄
app.get('/heroDelete',(req,res)=>{
    let id  = req.query.id
    //真删除
    dbHelper.deleteOne(
        'cqlist',
        {
            _id:dbHelper.ObjectId(id)
        },
        result =>{
            res.send({
                code:200,
                msg:'删除成功'
            })
        }
    )
})
//用户注册的接口
app.post('/register',(req,res)=>{
  //判断
  deHelper.find('userlist',{username:req.body.username},result=>{
    if(result.length === 0){
      //没有被用过 保存
      deHelper.insertOne('userlist',req.body,result=>{
        res.send({
          msg:'success!',
          code:200
        })
      })
    }else{
      res.send({
        msg:'该用户名已被注册，请重新输入',
        code:400
      })
    }
  })
})
// 开启监听
app.listen(8848)
