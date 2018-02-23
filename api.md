# goodluck api v1
  以下 api 路径均以 http://127.0.0.1:7001/api/v1 为前缀
  - 以下 api 都需要带上client参数
    - uuid 客户端编号
    - secret 客户端密钥
  - code说明
    - 200 成功

## 1. token
### 1.1 post /token 生成token
  - 接受post参数
    - account 用户账号
    - password 用户密码
  - 返回信息
    - code 状态码
    - data 如果成功则包含user及token信息

### 1.2 put /token/:access_token/:refresh_token 更新token
  - access_token access_token
  - refresh_token refresh_token
  - 返回信息
    - code 状态码
    - data 如果成功则包含最新token信息

### 1.3 delete /token/:access_token 删除token
  - access_token access_token
  - 返回信息
    - code 状态码

## 2. blog文章
## 3. tag标签
