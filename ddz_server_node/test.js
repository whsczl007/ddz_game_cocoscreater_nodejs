
const Carder = require("./game/carder.js")
const RoomState = {
    ROOM_INVALID: -1,
    ROOM_WAITREADY: 1,  //等待游戏
    ROOM_GAMESTART: 2,  //开始游戏
    ROOM_PUSHCARD: 3,   //发牌
    ROOM_ROBSTATE:4,    //抢地主
    ROOM_SHOWBOTTOMCARD:5, //显示底牌
    ROOM_PLAYING:6,     //出牌阶段  
}
 var carder = Carder()



	   var test_cards=
	   [
		   [{"cardid":5,"card_data":{"index":5,"value":1,"shape":2}},{"cardid":13,"card_data":{"index":13,"value":3,"shape":2}},{"cardid":11,"card_data":{"index":11,"value":2,"shape":4}},{"cardid":19,"card_data":{"index":19,"value":4,"shape":4}},{"cardid":21,"card_data":{"index":21,"value":5,"shape":2}},{"cardid":27,"card_data":{"index":27,"value":6,"shape":4}},{"cardid":29,"card_data":{"index":29,"value":7,"shape":2}}],
	   [{"cardid":5,"card_data":{"index":5,"value":2,"shape":2}},{"cardid":13,"card_data":{"index":13,"value":4,"shape":2}},{"cardid":11,"card_data":{"index":11,"value":3,"shape":4}},{"cardid":19,"card_data":{"index":19,"value":5,"shape":4}},{"cardid":21,"card_data":{"index":21,"value":6,"shape":2}},{"cardid":27,"card_data":{"index":27,"value":7,"shape":4}},{"cardid":29,"card_data":{"index":29,"value":8,"shape":2}}],
	   
	   [{"cardid":41,"card_data":{"index":41,"value":9,"shape":2}},{"cardid":42,"card_data":{"index":42,"value":9,"shape":3}},{"cardid":40,"card_data":{"index":40,"value":9,"shape":1}},{"cardid":10,"card_data":{"index":10,"value":2,"shape":3}}],
	   [{"cardid":47,"card_data":{"index":47,"value":10,"shape":4}},{"cardid":43,"card_data":{"index":43,"value":9,"shape":4}},{"cardid":33,"card_data":{"index":33,"value":8,"shape":2}},{"cardid":31,"card_data":{"index":31,"value":7,"shape":4}},{"cardid":24,"card_data":{"index":24,"value":6,"shape":1}}],
	   
	   [{"cardid":51,"card_data":{"index":51,"value":11,"shape":4}},{"cardid":49,"card_data":{"index":49,"value":11,"shape":2}},{"cardid":48,"card_data":{"index":48,"value":11,"shape":1}},{"cardid":20,"card_data":{"index":20,"value":5,"shape":1}},{"cardid":22,"card_data":{"index":22,"value":5,"shape":3}}],
	   
	   [{"cardid":4,"card_data":{"index":4,"value":1,"shape":1}},{"cardid":5,"card_data":{"index":5,"value":1,"shape":2}},{"cardid":11,"card_data":{"index":11,"value":2,"shape":4}},{"cardid":8,"card_data":{"index":8,"value":2,"shape":1}},{"cardid":15,"card_data":{"index":15,"value":3,"shape":4}},{"cardid":12,"card_data":{"index":12,"value":3,"shape":1}},{"cardid":17,"card_data":{"index":17,"value":4,"shape":2}},{"cardid":18,"card_data":{"index":18,"value":4,"shape":3}}],
	   
	   
	   
	   [{"cardid":42,"card_data":{"index":42,"value":9,"shape":3}},{"cardid":43,"card_data":{"index":43,"value":9,"shape":4}}],
	   
	   [{"cardid":52,"card_data":{"index":52,"king":14}},{"cardid":53,"card_data":{"index":53,"king":15}}],
	   
	   [{"cardid":4,"card_data":{"index":4,"value":1,"shape":1}},{"cardid":6,"card_data":{"index":6,"value":1,"shape":3}},{"cardid":47,"card_data":{"index":47,"value":10,"shape":4}},{"cardid":44,"card_data":{"index":44,"value":10,"shape":1}},{"cardid":46,"card_data":{"index":46,"value":10,"shape":3}}],
	   
	   [{"cardid":49,"card_data":{"index":49,"value":11,"shape":2}},{"cardid":51,"card_data":{"index":51,"value":11,"shape":4}},{"cardid":48,"card_data":{"index":48,"value":11,"shape":1}},{"cardid":5,"card_data":{"index":5,"value":1,"shape":2}},{"cardid":7,"card_data":{"index":7,"value":1,"shape":4}}]];
   
       for(var i=0;i<test_cards.length;i++){
		   //carder.toCardlist(test_cards[i])
		   for(var j=0;j<test_cards.length;j++){
		   // if(typeof(test_cards[i+1])!="undefined"){
			   
			   carder.compareCard(test_cards[i],test_cards[j]);
		   // }
		   }
	   }
   




