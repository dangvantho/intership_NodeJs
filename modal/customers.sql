create table customers(
    id varchar(20) primary key,
	contact_id varchar(20) references contacts(id),
	nation varchar(20) not null,
	age smallint not null,
	sex varchar(20) not null,
	name varchar(20) not null
);