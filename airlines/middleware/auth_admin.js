const pool= require('../pool')

module.exports=async function(req,res,next){
    const {email}= res.locals.user
    const data= await pool.query(`
       select name, id, email from admin where email=$1
    `,[email]).catch(err=> {
        res.json({ err })
        return
    })
    if(data.rowCount===0){
        res.json({err: 'Bạn không có quyền truy cập'})
        return
    }
    next()
}