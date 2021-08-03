create table contacts(
    id varchar(20) primary key,
    user_id varchar(20) not null references users(id) ,
    name varchar(50) not null,
    email varchar(50) not null,
    phone varchar(50) not null
);