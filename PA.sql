drop database if exists PA;

create database PA;

use PA;

create table inicio_sesion(usuario varchar (40),
							correo varchar(40),
							contra varchar(40),
                            tipo varchar(40),
							clave_maestra VARCHAR(100));
                            
create table doctor(usuario varchar (40),
					correo varchar(40),
					contra varchar(40));

insert into doctor(usuario,correo,contra) values
("Adan","adan@gmail.com","adancitopro"),
("Sebas","sebas@gmail.com","1234"),
("Yolo","yolo@gmail.com","empanada124"),
("Karen","karen@gmail.com","churritos2");

create table medicamento(nombre varchar(50),
						dosis varchar(50),
						horario varchar(50));
                            
select * from inicio_sesion;
select * from doctor;
select * from medicamento;