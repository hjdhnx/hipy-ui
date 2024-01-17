### hipy-ui 前端项目

##### 技术栈:  vue2 | ruoyi | element-ui

[套装传送门:hipy-server](https://github.com/hjdhnx/hipy-server/)  
[巨人的肩膀](https://github.com/JohnDoe1996/fastAPI-vue)

# <center> hipy-ui </center>

1. 安装node、npm  
   [去这里下载](https://registry.npmmirror.com/binary.html?path=node/v16.19.1/)

```shell
# 略
```

2. 安装相关第三方包

```shell
cd ./hipy-ui/dashborad   # 进入项目目录

npm i  # 安装包

npm uninstall husky --save
```

注意 npm 更换国内镜像源之后，将无法再使用 npm search命令，需要恢复为官方源才可以使用。 如果恢复官方源后还不可使用，运行删除注册表命令后重试即可。  
可能用到的npm换源命令

```shell
// 查询源
npm config get registry

// 更换国内源
npm config set registry https://registry.npmmirror.com

// 恢复官方源
npm config set registry https://registry.npmjs.org

// 删除注册表
npm config delete registry

npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install [name]

```

3. 开发环境配置

```shell
cp .env.development.example .env.development  # 复制配置文件

vim .env.development  # 编辑配置文件

npm run dev    # 测试运行程序 
```

4. 生产环境配置

```shell
cp .env.production.example .env.production  # 复制配置文件

vim .env.production  # 编辑配置文件

npm run build:stage  # 打包项目文件 (可以考虑在本地打包后把dies文件上传服务器部署)
```

### NGINX

使用Nginx反向代理后端项目和前端文件夹。

```shell
cd ./fastAPI-vue  # 进入项目根目录，此处目录仅供参加

cp ./nginx.conf.example  ./nginx.conf   # 拷贝配置文件

sudo ln -s /home/ubuntu/opt/fastAPI-vue/nginx.conf /etc/nginx/sites-enabled/fastapi_vue.conf   # 配置文件软链到Nginx的配置文件目录， 此处目录路径仅供参考

vim ./nginx.conf    # 编辑配置文件,已有参考配置，按需修改

nginx -t   # 检查Nginx配置文件 

nginx -s reload   # 重启Nginx
```
