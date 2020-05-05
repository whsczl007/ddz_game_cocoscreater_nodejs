import socketctr from "./data/socket_ctr.js"
import playerdata from "./data/player.js"
import eventlister from "./util/event_lister.js"
import api from "./util/api.js"

const myglobal = {} || myglobal
myglobal.socket = socketctr()
myglobal.playerData = playerdata()
myglobal.eventlister = eventlister({})
myglobal.api= api()
export default myglobal
