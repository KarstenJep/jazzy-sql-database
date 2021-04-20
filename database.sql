CREATE TABLE "artist" (
	"id" serial primary key,
	"name" varchar(80) not null,
	"birthdate" date
	);

CREATE TABLE "song" (
	"id" serial primary key,
	"title" varchar(255),
	"length" varchar(10),
	"released" date
	);