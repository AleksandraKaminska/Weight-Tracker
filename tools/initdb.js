"use strict";

const dotenv = require( "dotenv" );
const postgres = require( "postgres" );

const init = async () => {
	// read environment variables
	dotenv.config();

	try {
		// connect to the local database server
		const sql = postgres();

		console.log( "dropping table, if exists..." );
		await sql`DROP TABLE IF EXISTS measurements`;
		await sql`DROP TABLE IF EXISTS heights`;
    await sql`DROP TABLE IF EXISTS sleep_measurements`;
    await sql`DROP TABLE IF EXISTS water_measurements`;
    await sql`DROP TABLE IF EXISTS steps`;

    console.log( "creating tables..." );

		await sql`CREATE TABLE IF NOT EXISTS measurements (
			id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
			, user_id varchar(50) NOT NULL
			, measure_date date NOT NULL
			, weight numeric(5,1) NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS heights (
			id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
			, user_id varchar(50) NOT NULL
			, measure_date date NOT NULL
			, height numeric(3,2) NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS water_measurements (
			id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			user_id varchar(50) NOT NULL,
			measure_date date NOT NULL,
      milliliters numeric(6,1) NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS sleep_measurements (
			id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			user_id varchar(50) NOT NULL,
      minutes numeric(5,1) NOT NULL,
      start_at timestamp NOT NULL,
      end_at timestamp NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS steps (
      id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id varchar(50) NOT NULL,
      steps numeric(6,0) NOT NULL,
      start_at timestamp NOT NULL,
      end_at timestamp NOT NULL
    )`;

		await sql.end();
	} catch ( err ) {
		console.log( err );
		throw err;
	}
};

init().then( () => {
	console.log( "finished" );
} ).catch( () => {
	console.log( "finished with errors" );
} );
