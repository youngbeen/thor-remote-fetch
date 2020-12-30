#!/usr/bin/env node

const axios = require('axios')
const fs = require('fs')
const style = require('chalk')

const info = style.cyan.bold
const success = style.green.bold
const warning = style.yellow.bold
const error = style.red.bold
const tip = style.gray

const fetchData = () => {
  // 开始获取
  let content = fs.readFileSync('src/models/SystemConfig.js', {
    encoding: 'utf-8'
  })
  let url = content.match(/(?<=systemConfigRequestUrl: ').*(?=',)/)[0] || ''
  if (!url) {
    console.error(error('配置文档中未配置获取配置信息的api url'))
    return
  }
  console.log(`开始获取... - ${info(url)}`)
  axios.get(url).then(data => {
    // console.log(data.data)
    if (data && data.status === 200) {
      console.log('获得远程配置接口应答')
      fixConfig(data.data.data)
    }
  }).catch(err => {
    console.log(error(err))
  })
}

const fixConfig = (data) => {
  // data<js object>, content<js string>
  if (!data) {
    console.error(error('无远程业务数据！'))
    return
  }
  let remoteBizPages = data
  let content = fs.readFileSync('src/models/SystemConfig.js', { encoding: 'utf-8' })
  let newContent = content.replace(/(?<=remotePages:)(.|\r|\n)*(?=})/, remoteBizPages)
  // console.log(newContent)

  fs.writeFileSync('src/models/SystemConfig.js', newContent, {
    encoding: 'utf-8'
  })
  console.log(success('写入远程业务数据完成'))
}

fetchData()
