const checkPassword= (value)=>{
    let regex = /^.{8,20}$/g;
    if(!regex.test(value)){
        return false
    } else{
        return true
    }
}
 const checkEmail= value=>{
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!regex.test(value)){
        return false
    }else{
        return true
    }
}
const checkName= value=>{
    let regex = /([A-Za-z0-9]{1,50})/g;
    if(!regex.test(value)){
        return false
    } else {
        return true
    }
}
const checkPhone= value=>{
    let regex=/(84|0[3|5|7|8|9])+([0-9]{8})\b/
    if(!regex.test(value)) return false
    else return true
}
const validate= form=>{
    let errs={}
    if(Object.keys(form).length===0) return {status: false, errs: {}}
    for(let key in form){
        if(!form[key] && form[key]!==0) errs[key]='Không được để trống'
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

export default {
    checkEmail,
    checkName,
    checkPassword,
    checkPhone,
    validate,
    formatMoney,
    getDate
}