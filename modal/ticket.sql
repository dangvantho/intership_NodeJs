create table ticket(
    id varchar(20) primary key,
    user_id varchar(20) references users(id),
    contact_id varchar(20) references contacts(id),
    flight_seat int not null references flight_seat(id), 
    date_flight date not null,
    create_at timestamp default now(),
    verify boolean default false
);