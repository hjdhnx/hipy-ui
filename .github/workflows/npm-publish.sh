on: 
  push: 
    branches: 
      - main # 这里表示push到main分支就会触发流程
  workflow_dispatch:
    
jobs:
  deploy_job:
    runs-on: ubuntu-20.04
    steps:
    - uses: actions/checkout@v4
      with:
        persist-credentials: false
    - uses: actions/setup-node@v4
      with:
        node-version: 18.19.0
    # 安装 sed 工具
    #  - name: Install Sed Tool (Optional)
    #    run: sudo apt update && sudo apt install -y sed
    - run: |
         cd dashboard
         npm i
         sed -i 's/http:\/\/fastapi-vue-api.beginner2020.top/${{secrets.URL}}/g' ./.env.production
         NODE_OPTIONS=--openssl-legacy-provider npm run build:prod

    # 连接到ssh，并且做一个拷贝操作的action
    - name: deploy
      uses: easingthemes/ssh-deploy@main
      env:
         # 本地.ssh文件下的私钥id_rsa，存在secrets的PRIVATE_KEY中
       SSH_PRIVATE_KEY: ${{ secrets.KEY_DEBIAN}}
          # 复制操作的参数。"-avzr --delete"意味部署时清空服务器目标目录下的文件
       ARGS: "-avzr --delete" 
          # 源目录，相对于$GITHUB_WORKSPACE根目录的路径
       SOURCE: "dashboard/dist/"
          # 服务器域名/IP
       REMOTE_HOST: ${{ secrets.SSH_HOST }}
          # 服务器用户名
       REMOTE_USER:  ${{ secrets.SSH_USER }}
          # 目标目录
       TARGET: '/home/www/dist'
          # 排除目录
         #EXCLUDE: "configs,db/hipy.db,main.py"
         #SCRIPT_BEFORE: rm -rf /home/www/dist/*
       SCRIPT_AFTER: chmod -R 777 /home/www/dist

       
       
       
       
       
       
      
