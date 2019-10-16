# Nodejs-RESTful-API-zhihu
Koa2 设计RESTful API放知乎接口

### 前后端接口文档最终展示：https://documenter.getpostman.com/view/8483611/SVtYQkrk?version=latest

### 项目上线-部署-配置

购买SSH登录服务器（阿里云/腾讯云服务器）
↓
购买了的话，会分配一个公网的ip，及其用户名及密码
↓
`ssh root@92.97.104.1`  → 执行登录操作，其中root为分配的用户名，@后面的即是分配的公网ip，自己对号入座
↓
然后输入分配的密码，即可完成登录
↓
安装git `apt-get install git`，将写好的代码下载到服务器 `git clone git@github.com:Umbrella001/Nodejs-RESTful-API-zhihu.git`
↓
安装Node.js（因为项目是基于Node环境进行开发的）

```js
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
关于在服务器中安装Node可以参考 → [NodeSource文档](https://github.com/nodesource/distributions)
↓
成功搭建环境后，我们安装项目所需要的依赖 `npm install `
↓
最后直接 `npm run dev` （可以项目中配置的Script命令），注意这里会出现端口的额占用，即使不占用 通过 `92.97.104.1:3000` 的话也是不成功的，因为服务器为了安全起见不会分配很多端口给你的，一般都是http → 80端口 | https → 443，但是本地杀掉对应的占用端口不现实，所以我们需要使用Nginx进行反向代理
↓ 
使用Nginx实现端口的转发
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191015172125828.png)↓
安装Nginx `apt-get install nginx`，可以通过 `nginx -t` 获取配置文件的位置
↓
通过 `vim <nginx配置文件的地址>` 进入配置文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191015172637276.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1VtYnJlbGxhX1Vt,size_16,color_FFFFFF,t_70)
上面的步骤是修改了配置文件后的，检查用的
↓ 
重新启动nginx，让修改的内容生效 `sudo service nginx reload`
↓
此时重新启动服务 `npm run dev` 再去浏览器访问，发现我们可以看到我们项目中涉及的接口信息啦 ~撒花✿
