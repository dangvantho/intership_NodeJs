create table users(
    id varchar(20) primary key,
    name varchar(50),
    email varchar(50) unique,
    password varchar(50),
    verify boolean default false
);
