module.exports = (req, res, next) => {
  let { location, price, _limit, page } = req.query;
  let template = "select * from info_ticket where _time > now()  ";
  let values = [];
  let index = 1;
  if (location) {
    const intervalLocation = location.split("-");
    template += "_from=$1 and _to=$2 ";
    values.push(intervalLocation[0]);
    values.push(intervalLocation[1]);
    index = 3;
    if (price) template += "and ";
  }
  if (price) {
    const intervalPrice = price.split("-");
    template += `price > $${index} and price <$${index + 1}`;
    values.push(intervalPrice[0]);
    values.push(intervalPrice[1]);
  }
  _limit ? (template += ` limit ${_limit} `) : (template += " limit 15 ");
  page ? (template += `offset ${(page - 1) * (_limit || 15)}`) : "";
  res.locals.template = template;
  res.locals.values = values;
  next();
};
