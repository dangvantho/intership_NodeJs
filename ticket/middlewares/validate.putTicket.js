module.exports= (req,res,next)=>{
    const {flight, flight_seat}= req.body
    try {
        for(let value of flight_seat){
            for(let key in value){
                if(typeof (value[key]-0) !=='number'){
                    res.json({err:'Thông tin flight_seat bị sai định dạng'})
                    return
                }
            }
        }
        if(!flight ){
            res.json({err:'Thiếu thông tin chuyến bay'})
            return
        }
        next()
    } catch (error) {
        res.json({err: error})
    }
}