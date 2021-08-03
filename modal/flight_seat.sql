create table flight_seat(
    id serial primary key,
    flight_id int not null references flight(id),
    seat_id int not null references seats(id),
    price int not null,
    quantity smallint not null
);