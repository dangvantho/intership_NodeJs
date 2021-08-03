const checkPassword= (value)=>{
    if(!value) return false
    let regex = /^.{8,20}$/g;
    if(!regex.test(value)){
        return false
    } else{
        return true
    }
}
 const checkEmail= value=>{
     if(!value) return false
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if(!regex.test(value)){
        return false
    }else{
        return true
    }
}
const checkName= value=>{
    if(!value) return false
    let regex = /^[A-Za-z0-9]{8,20}$/g;
    if(!regex.test(value)){
        return false
    } else {
        return true
    }
}
const checkPhone= value=>{
    if(!value) return false
    let regex=/(84|0[3|5|7|8|9])+([0-9]{8})\b/
    if(!regex.test(value)) return false
    else return true
}
const validate= form=>{
    let errs={}
    if(Object.keys(form).length===0) return {status: false, errs: {}}
    for(let key in form){
        if(!form[key]) errs[key]='Không được để trống'
        else errs[key]= null
    }
    for(let key in errs){
        if(errs[key]) return {errs, status: false}
    }
    return {status: true, errs: {}}
}
const formatMoney=(price, type)=>{
    if(!price) return null
    if(typeof price ==='number' && type !==1 ) return price-0
    // Chuyển từ tiền sang tiền có dấu phẩy
    if(type===1){
        price= price+''
        price = price
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return price  
    }
    // Chuyển từ dạng có dấu phảy thành số
    else{
        return price.split(',').join('')-0
    }
}
const getDate= (date)=>{
    switch(date){
        case 1:
          return 'Thứ hai'
        case 2:
          return 'Thứ ba'  
        case 3:
          return 'Thứ tư'
        case 4:
          return 'Thứ năm'
        case 5:
          return 'Thứ sáu'
        case 6:
          return 'Thứ bảy'
        case 0:
          return 'Chủ nhật'          
      }
}
const formatDateString= date=>{
    const str= `0${date}`
    const len= str.length
    return `${str[len-2]}${str[len-1]}`
}
const getDayString= date=>{
    const day= formatDateString( date.getDate() ),
          month= formatDateString( date.getMonth()+1 ),
          year= date.getFullYear();
    return `${day}/${month}/${year}`      
}
const getDayTime= (date)=>{
    if(typeof date !=='string') return new Date(Date.now())
    const time= date.split('/')
    const day= time[0],
          month= time[1]-1,
          year= time[2];     
    return new Date(year, month, day)      
}

export default {
    checkEmail,
    checkName,
    checkPassword,
    checkPhone,
    validate,
    formatMoney,
    getDate,
    getDayString,
    getDayTime
}