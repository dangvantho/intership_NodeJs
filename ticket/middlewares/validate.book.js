const pool = require("../pool");
const shortId = require("../config/shortId");

const createCustomer = async (data) => {
  try {
    let { contact_id, age, sex, nation, name } = data;
    age = parseInt(age);
    const id = shortId.generate();
    const values = [id, contact_id, age, sex, nation, name];
    const value = await pool.query(
      `
          insert into customers(id, contact_id, age, sex, nation, name)
          values ($1,$2,$3,$4,$5,$6)
        `,
      values
    );
    console.log(value)
    return value
  } catch (error) {
    return { err: error };
  }
};
const checkForm = (form) => {
  const err = {};
  for (let key in form) {
    if (!form[key]) err[key] = `Thiếu ${key}`;
  }
  if (form.email || form.phone) {
    const regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    const regexEmail =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
    let { email, phone } = form;
    email = email.toLowerCase();
    if (!regexEmail.test(email)) {
      err.email = "Email không hợp lệ";
    }
    if (!regexPhone.test(phone)) {
      err.phone = "Số điện thoại không hợp lệ";
    }
  }
  if (Object.keys(err).length > 0) {
    return { err };
  } else return { message: "Validate" };
};
const getTimeDate= (time, format)=>{
  let [t1, t2, t3]= time.split('/')
  if(format.toLowerCase()==='dd/mm/yyyy'){
    return {
      date: new Date(t3, t2-1, t1),
      str: `${t2}/${t1}/${t3}`
    }
  }else if(format.toLowerCase()==='mm/dd/yyyy'){
    return {
      date: new Date(t3,t1-1, t2),
      str: time
    }
  }
}
module.exports = async (req, res, next) => {
  try {
    let { user, contact, customers, ticket } = req.body;
    //Check thông tin vé
    let {date_start, date_end, quantity, isdelete, flight_seat, }= ticket
    console.log(date_end, date_start)
    let today= new Date(Date.now())
    date_start= getTimeDate(date_start, 'mm/dd/yyyy')
    date_end= getTimeDate(date_end,'mm/dd/yyyy')
    if(date_start.date > today || date_end.date < today || isdelete){
      res.json({
        err:'Chuyến bay này đã tạm dừng'
      })
      return
    }
    //Xác định số vé đã mua
    let countTicket=await pool.query(`
    select sum(ticket.quantity) as totalCount from ticket where flight_seat=$1
    `,[flight_seat])
    countTicket = countTicket.rows[0].totalCount - 0 || 0
    //Xác định tổng số vé
    let count= await pool.query('select quantity from flight_seat where id=$1',[flight_seat])
    count= count.rows[0].quantity 
    //Check có đủ vé không
    if( (quantity-0) + countTicket > count){
      res.json({
        err:'Chuyến bay không đủ vé '
      })
      return
    }
    console.log(countTicket, count, quantity)
    let user_id;
    //Create account if user haven't account
    if (!user) {
      let id = shortId.generate();
      try {
        const data = await pool.query(
          `
                  insert into users(id, name)
                  values ($1, $2)
                `,
          [id, "client"]
        );
        user_id = id;
        res.locals.clientId = id;
      } catch (error) {
        res.json({ err: "Fail" });
      }
    } else {
      user_id = user.id;
      res.locals.clientId = user.id;
    }
    //Create contact
    let check = checkForm(contact);
    if (check.err) {
      res.json({ err: check.err, clientId: user_id });
      return
    }
    let contactId = shortId.generate();
    await pool.query(
      `
          insert into contacts(id, user_id, name, phone, email)
          values ($1, $2, $3, $4, $5) returning id
        `,
      [contactId, user_id, contact.name, contact.phone, contact.email]
    );
    res.locals.email = contact.email;
    res.locals.contactId = contactId;
    //Create customers
    if (Array.isArray(customers)) {
      // Kiểm tra form thông tin người đặt vé
      for (let customer of customers) {
        let check = checkForm(customer);
        if (check.err) {
          res.json({ err: check.err });
        }
      }
      // Tạo thông tin liên lạc mới
      for (let customer of customers) {
        customer = { ...customer, contact_id: contactId };
        let id = await createCustomer(customer);
        if (id.err) {
          res.json({ err: id.err, clientId: user_id });
          return
        }
      }
    } else {
      let check = checkForm(customers);
      if (check.err) {
        res.json({ err: check.err });
        return
      }
      customers = { ...customers, contact_id: contactId };
      let id = await createCustomer(customers);
      if (id.err) {
        res.json({ err: id.err, clientId: user_id });
        return
      }
    }
    next();
  } catch (error) {
    res.json({ err: "Không đủ vé" });
    return
  }
};
