exports.defaultGoldCount = 100;
exports.roomFullPlayerCount = 3;

exports.createRoomConfig = {
    '1': {
        needCostGold: 1,
        bottom: 1,
        rate: 1
    },
    '2': {
        needCostGold: 20,
        bottom: 10,
        rate: 2
    },
    '3': {
        needCostGold: 60,
        bottom: 20,
        rate: 3
    },
    '4': {
        needCostGold: 120,
        bottom: 30,
        rate: 4
    }
};

exports.qian_state = {
    buqiang:0,
    qian:1,
}

exports.db_config={
   "host": "127.0.0.1",
   "port": "3306",
   "user": "root",
   "password": "123456",
   "database": "game_ddz"
}
