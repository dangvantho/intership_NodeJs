module.exports= function(req, res, next){
    const { name, email}= req.body
    const { user } = res.locals
    let template= `update users set `
    const values=[]
    let index=1
    if(name){
        template+= `name = $${index},`
        values.push(name)
        index++
    }
    if(email){
        template+= `email= $${index},`
        values.push(email)
        index++
    }
    if(values.length===0){
        res.json({ 
            err: 'Bạn cần thêm thông tin muốn thay đổi',
        })
        return
    }
    template= template.slice(0, -1)
    template+= ` where id=$${index}`
    values.push(user.id)
    res.locals.template= template
    res.locals.values= values
    console.log(template, values)
    next()

}