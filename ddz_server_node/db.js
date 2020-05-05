const mysql = require("mysql")
var mysqlHandle = undefined

const query = function(sql,callback){
    //获取一个连接
    console.log("query:" + sql)
    mysqlHandle.getConnection(function(err,conn){
       
        if(err){
           
            console.log(err+ " sql:"+ sql)
            if(callback){
                callback(err)
            }
        }else{
           
            conn.query(sql,function(err,result){
                 if(err){
                    console.log(err+ " sql:"+ sql)
                    if(callback){
                       callback(err,nil)   
                    }
                 }else{
                   
                    if(callback){
                       console.log("result:" + result)
                       callback(null,result)      
                    }
                    
                 } 

                 conn.release()
            })
        }
    })   
}
// const getConnection=function(callback){
// 	mysqlHandle.getConnection(function(err,conn){
	
// 	}
// 	}
// }

const async_query = function(sql) {
	return new Promise((resolved, rejected)=>{
		mysqlHandle.getConnection(function(err,conn){
		   
		    if(err){
				console.log("未获取到数据库 conn")
		         rejected(null);
		    }else{
		  
		    conn.query(sql,(err,result)=>{
				
			   if(err){
				   console.log("sql 语句执行错误"+err)
				   rejected(null);
			   }
			   else{
				//    console.log("sql 执行正确"+JSON.stringify(result))
				resolved(result);
			   }
			})
		  }		
	  });			
	});
}
const sql_query=async function(sql){
	var result=false;
	try {
	   result= await async_query(sql);
	}catch(error){
		console.log("执行错误")
		return false
	}
	
	//console.log("sql_query result"+JSON.stringify(result));
	return result;
}



exports.getPlayerInfoByAccountID =  function(accountID,callback) {
    var sql = 'select * from t_account where account_id = ' + accountID + ';';
    query(sql,callback)
	 // var  r=await sql_query(sql);
	 // console.log("r:"+JSON.stringify(r))
  //   return r;
}

exports.getPlayerInfoByUniqueID = function(uniqueID,callback){
   var sql =  'select * from t_account where unique_id = ' + uniqueID + ';';
   query(sql,callback)
}


exports.updatePlayergold=function(accountID,count){// 加减金币
	var sql = "update  t_account set gold_count	=gold_count	+("+count+") where account_id='"+accountID+"' limit 1;";
	return sql_query(sql);
	
	
}
exports.updatePlayerfkcount=function(accountID,count){// 加减房卡数
	
	  var sql = "update  t_account set fkcount	=fkcount	+("+count+") where account_id='"+accountID+"' limit 1;";
	  return   sql_query(sql);
}
exports.kf_log=async function(room_id,player_accountID,fkcount){// 插入开房记录
	var sql="insert into t_kf_log (room_id,player_id,card_count,addtime) values ("+room_id+",'"+player_accountID+"',"+fkcount+","+parseInt( Date.now()/1000)+");";
    return  sql_query(sql);
}


exports.createPlayer = function(userinfo,callback){
    var sql = 'insert into t_account(unique_id, account_id,nick_name,avatar_url) values('
        + "'" +userinfo.unique_id
        + "'" + ','
        + "'" + userinfo.account_id
        + "'" + ','
        + "'" +userinfo.nick_name
        + "'" + ',' 
         // +userinfo.gold_count +','
        + "'" + userinfo.avatar_url
        + "'" + ') on duplicate key update nick_name=values(nick_name);' ;
    console.log("createPlayer sql:"+sql)
    query(sql, (err, data)=>{
        if (err){
            console.log('create player info = ' + err);
        }else
        {
			callback();
            // console.log('create player info = ' + JSON.stringify(data));
        }
    });
}

 exports.insert=function(info, table,callback) {
        // info = { key: value }
        // table = String
        let sql = "INSERT INTO " + table + "(";
        let keyArray = [];
        let valueArray = [];
        Object.keys(info).forEach((key) => {
            keyArray.push(key);
            valueArray.push("'" + info[key] + "'");
        });
        let keyStr = keyArray.join(',');
        let valueStr = valueArray.join(',');
        sql += keyStr + ') ';
        sql += 'VALUES(' + valueStr + ')';
        return query(sql,callback);
    }

const _handleWhereString=function(where, link) {
        let str = "";
        let whereArray = [];
        Object.keys(where).forEach((key) => {
			// if(typeof(where[key])=="String"){
				
			// }
            whereArray.push(String(key + "='" + where[key] + "'"));
        });
        if (link) {
            let whereStr = whereArray.join(" " + link + " ");
            str += " WHERE " + whereStr;
        } else {
            let whereStr = whereArray.join(" AND ");
            str += " WHERE " + whereStr;
        }
        return str;
    }
     exports.update=function(info, table, where, link,callback) {
        let sql = "UPDATE " + table + " SET ";
        let sqlArray = [];
        Object.keys(info).forEach((key) => {
            sqlArray.push(key + "='" + info[key] + "'");
        });
        sql += sqlArray.join(',');
        if (where) {
            sql += _handleWhereString(where, link);
        }
        return query(sql,callback);
    }
	

exports.connect = function(config){
    mysqlHandle = mysql.createPool(config)
}
