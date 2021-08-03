module.exports = (req, res, next) => {
  let { _from, _to, weekday, airline, day, _limit, page } =
    req.query;
  const values = { _from, _to, weekday, airline };
  let index = 1;
  let template = `
  select f.*,
          l1.name as _from, l2.name as _to, a.name as airline
  from flight as f
  inner join locations as l1 on f._from=l1.id
  inner join locations as l2 on f._to=l2.id
  inner join airlines as a on f.airline=a.id
  where f.date_start < now() and f.date_end > now() and isdelete=false and 
  `;
  let array = [];
  for (let key in values) {
    if (!values[key]) delete values[key];
    else {
      array.push(values[key]);
      template += `${key}=$${index} and `;
      index++;
    }
  }
  if(day && typeof day==='string'){
    console.log(day)
    const time= day.split('/')
    const date= time[0],
          month= time[1] -1 ,
          year= time[2];
    let beforeDay= new Date(year, month, date, 0, 0)
    let nextDay= new Date(year, month, date, 24, 0)
    let today= new Date(Date.now())
    const hour= today.getHours()
    const minutes= today.getMinutes()
    const timeStamp= `${hour}:${minutes}`
    console.log(timeStamp, beforeDay, nextDay, today)
    if(beforeDay < today && nextDay > today){
      template+=`_start > $${index} and `
      array.push(timeStamp)
    } else if(beforeDay < today){
      res.json({
        data: [],
      })
      return
    }      
  }
  if (array.length > 0) {
    template = template.slice(0, template.length - 4);
  } 
  // _limit ? (template += ` limit ${_limit} `) : (template += " limit 15 ");
  // page ? (template += `offset ${(page - 1) * (_limit || 15)}`) : "";
  res.locals.template = template;
  console.log(template, array)
  res.locals.values = array;
  next();
};
