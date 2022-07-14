drop table if exists users;
create table users (login text primary key, password text, role text);
insert into users (login, password, role) values ('admin', 'admin1', 'sua');
insert into users (login, password, role) values ('user', 'user1', 'u');
insert into users (login, password, role) values ('audit', 'audit1', 'a');

drop table if exists invoices;
create table invoices (id integer primary key autoincrement, no text, client text);
create unique index u_no on invoices (no);

drop table if exists invoice_items;
create table invoice_items (id integer primary key autoincrement, invoice_id integer, name text, price real, quantity real, vat real);