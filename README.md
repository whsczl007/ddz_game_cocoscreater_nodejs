# 游戏定制外包、棋牌源码部署、商务合作 联系 gamer666666@qq.com

斗地主游戏 cocoscreator-nodejs-mysql

服务器 : Centos 7.2

服务端 : node.js v16.13.2  

Nodejs: (npm 8.1.2, mysql ^2.17.1, nodejs-websocket ^1.7.2)

客户端: cocos creator2.3.3

数据库 ：mysql 5.6.47


## 扫码体验
[![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/qr_url.png)](https://whsczldemo.pages.dev/ddz_ioshelper/index.html)
[!(https://whsczldemo.pages.dev/ddz_ioshelper/index.html)]

## 打赏作者
[![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/alipays.png)](https://qr.alipay.com/fkx08759pyy1lfuphn99353)

## 修改及增加如下

### 前端：
 修改：增加登录缓存，使游客登录相同账号。（原：每次登录生成新账号） 
 
 添加：进入大厅显示 用户头像、昵称。（原：固定头像和昵称）
 
 添加：大厅-创建房间-高级房 添加点击及相关功能。（原：点击没反应）
 
 修复：大厅-加入房间-房间号长度大于6-点击后退。（原：点击后退报错）
 
 添加：游戏界面-返回大厅按钮。
 
 添加：叫地主 定时器功能。
 
 添加：等待出牌 定时器功能。
 
 修复：重新回到游戏界面报错，移除事件监听。（原：退出游戏界面，事件监听未去除）
 
 增加：重新回到游戏界面，恢复手牌、底牌、计时器、上次出牌等。
 
 修复：大厅-加入房间-增加游戏满员提示。（原：超过3人进入游戏、玩家界面重叠）
 
 修改：统一座位出牌顺序为逆时针。（原：抢地主和出牌时，有些座位看是顺时针，有些座位看是逆时针）
 
 添加：有玩家游戏掉线提示。
 
 添加：有玩家离开房间通知。
 
 添加：有玩家游戏中逃跑通知及强制结束游戏。 
 
 添加：游戏结束得分提示。
 
 添加：有玩家游戏中掉线 后  重新回到游戏 提示。
 
 修复：手牌不是17张时 发牌动画 报错。
 
 添加：全局 Alert 和 Toast 插件。
 
 添加：本局结束后 分数不够 被踢出房间提示。
 
 删除：弃用本地 createRoomConfig 配置，改为服务器 配置 房间等级 分数 倍数。
 
 添加：玩家分数变更 后 刷新界面分数。
 
 
### 服务端
 修改： 每个房间新建一个数据库连接。（原：app全局共用一个数据库连接）
 
 修改：用户登录连接 转移到 player.js
 
 增加：用户断线后 未登录判断
 
 添加：玩家掉线，从在线列表移除。
 
 添加：玩家掉线后，自动从房间中退出 或 游戏中离线。

 添加：玩家掉线后，通知其它玩家 有玩家退出或掉线。
 
 添加：创建房间增加金币判断。
 
 添加：创建房间减一张房卡。
 
 修改：加入房间，增加游戏中掉线 后 重新回到游戏功能。
 
 添加：加入房间 增加人数判断。
 
 添加：加入房间 增加金币门槛判断。
 
 添加：恢复牌局信息接口，包括 手牌、底牌、当前出牌计时器、上次出牌等。
 
 添加：增加重置游戏功能，用于游戏结束后 直接开启下一局。
 
 添加：下一局开始前 自动踢出 已掉线玩家。
 
 添加：下一局开始前 自动踢出 分数不足玩家。
 
 添加：所有玩家都离开房间后 回收房间功能。
 
 添加：游戏结束判断。
 
 修复：出牌时判断是否轮到自己出牌。（原：没轮到自己都可以出牌，且 多个人可以一起出牌）
 
 修复：有玩家不出牌时 没有通知其他玩家，导致其他玩家看到的都是这个玩家之前所出的牌。
 
 添加：游戏结束 后 计算分数。
 
 添加：有玩家游戏中逃跑后  强制结束游戏 及 计算分数。
 
 添加：抢地主超时自动判为不抢，并且 自动轮到下一位 抢。
 
 添加：出牌超时自动判为不出，并且自动 轮到下一位出。
 
 添加：房主开始游戏时 判断 游戏人数、玩家分数、准备状态。

 添加：房主开始游戏时 扣取玩家 入场分。
 
 添加：创建房间日志、开局日志、出牌日志。
 
 修复：上一个出牌玩家 是自己的时候 跳过 牌大小比较。（原：其它玩家不出牌时 自己不能出比上次小的牌）

 修改：修改牌值大小判断逻辑。
 
 添加：牌值权重。（王炸3 >炸弹2 >其它1 ,权重大 吃小，权重相同 判断牌型及大小） 



![image ](https://ddzservernode.al666666.cn/c2.png)
![image ](https://ddzservernode.al666666.cn/c5.png)
![image ](https://ddzservernode.al666666.cn/c7.png)

![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/1.png)
![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/2.png)
![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/3.png)
![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/4.png)
![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/5.png)
![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/6.png)
![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/7.png)
![image ](https://raw.githubusercontent.com/whsczl007/ddz_game_cocoscreater_nodejs/master/image/8.png)








