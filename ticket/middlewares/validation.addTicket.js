const shortId = require("../config/shortId");
function checkTime(time, type){
  if(!time && time!==0) return null
  if(type=='date'){
    const date=[0,1,2,3,4,5,6]
    if(!date.includes(time)) return null
    return time
  } else if(type=='time'){
    let regex=/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g
    if(!regex.test(time)) return null
    return time
  } else{
    let regex= /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/g
    if(!regex.test(time)) return null
    return time
  }
}
function checkSeat(arrSeat){
  for(let value of arrSeat){
    for(let key in value){
      if(typeof (value[key]-0) !=='number') return false
    }
  }
  return true
}
module.exports = (req, res, next) => {
  const {flight, flight_seat}=req.body || res.locals.data;
  let {_from, _to, weekday, _start, _end, airline, date_start, date_end} = flight
    
  weekday= checkTime(weekday,'date')
  _start= checkTime(_start,'time')
  _end= checkTime(_end,'time')
  date_start= checkTime(date_start)
  date_end= checkTime(date_end)
  if( (!weekday && weekday!==0) || !_start || !_end || !date_start || !date_end){
    res.json({
      err: 'Định dạng thời gian sai'
    })
    return
  }
  const values = [_from, _to, weekday, _start, _end, airline, date_start, date_end];
  for (let value of values) {
    if (!value && value!==0) {
      res.json({
        err: 'Thiếu thông tin chuyến bay'
      })
      return
    }
  }
  if(!checkSeat(flight_seat)){
    res.json({
      err:'Thông loại ghế và giá tiền sai'
    })
    return
  }
  res.locals.values = values;
  next();
};
