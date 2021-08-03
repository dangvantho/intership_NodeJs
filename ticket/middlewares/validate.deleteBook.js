const pool= require('../pool')
module.exports= async(req,res,next)=>{
    const {id}= req.params
    try {
        const data=await pool.query('select date_flight, contact_id from ticket where id=$1',[id])
        if(data.rowCount!==1){
            res.json({
                err:'Không tồn tại vé này',
            })
            return
        }
        let date= data.rows[0].date_flight
        let today= new Date(Date.now())
        today.setDate(today.getDate() + 2 )
        if(today > new Date(date)){
            res.json({
                err:'Bạn phải hủy vé trước 2 ngày',
            })
            return
        }
        res.locals.contact_id= data.rows[0].contact_id
        next()
    } catch (error) {
        res.json({err: error})
        return
    }
}