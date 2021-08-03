create table flight(
    id serial primary key,
    _from int not null references locations(id),
    _to int not null references locations(id),
    weekday smallint not null,
    _start time not null,
    _end time not null,
    airline int not null references airlines(id),
    date_start date not null,
    date_end date not null,
    isDelete boolean default false,
);
