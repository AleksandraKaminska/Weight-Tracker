"use strict";

const boom = require( "@hapi/boom" );
const joi = require( "@hapi/joi" );

// add a new height for the current user
const addHeightForCurrentUser = {
	method: "POST",
	path: "/api/heights",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const { measureDate, height } = request.payload;
			const res = await h.sql`INSERT INTO heights
				( user_id, measure_date, height )
				VALUES
				( ${ userId }, ${ measureDate }, ${ height } )
		
				RETURNING
					id
					, measure_date AS "measureDate"
					, height`;
			return res.count > 0 ? res[0] : boom.badRequest();
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" },
		validate: {
			payload: joi.object( {
				measureDate: joi.date(),
				height: joi.number()
			} )
		}
	}
};

// retrieve all heights for the current user
const allHeightsForCurrentUser = {
	method: "GET",
	path: "/api/heights",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const heights = await h.sql`SELECT
					id
					, measure_date AS "measureDate"
					, height
				FROM heights
				WHERE user_id = ${ userId }
				ORDER BY
					measure_date`;
			return heights;
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" }
	}
};

// delete a height for the current user by id
const deleteHeightForCurrentUserById = {
	method: "DELETE",
	path: "/api/heights/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const res = await h.sql`DELETE
				FROM heights
				WHERE id = ${ id }
					AND user_id = ${ userId }`;
			return res.count > 0 ? h.response().code( 204 ) : boom.notFound();
		}
		catch( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" },
		validate: {
			params: joi.object( {
				id: joi.number().integer()
			} )
		}
	}
};

// get one height for the current user by id
const getHeightForCurrentUserById = {
	method: "GET",
	path: "/api/heights/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const res = await h.sql`SELECT
				id
				, measure_date AS "measureDate"
				, height
			FROM heights
			WHERE user_id = ${ userId }
				AND id = ${ id }`;
			return res.count > 0 ? res[0] : boom.notFound();
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" },
		validate: {
			params: joi.object( {
				id: joi.number().integer().message( "id parameter must be number" )
			} )
		}
	}
};

// update a height for the current user by id
const updateHeightForCurrentUserById = {
	method: "PUT",
	path: "/api/heights/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const { measureDate, height } = request.payload;
			const res = await h.sql`UPDATE heights
				SET measure_date = ${ measureDate }
					, height = ${ height }
				WHERE id = ${ id }
				AND user_id = ${ userId }

				RETURNING
				id
				, measure_date AS "measureDate"
				, height`;
			return res.count > 0 ? res[0] : boom.notFound();
		}
		catch( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" },
		validate: {
			params: joi.object( {
				id: joi.number().integer()
			} ),
			payload: joi.object( {
				measureDate: joi.date(),
				height: joi.number()
			} )
		}
	}
};

// get last height for the current user
const lastHeightForCurrentUser = {
	method: "GET",
	path: "/api/heights/last",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const height = await h.sql`SELECT
					id
					, measure_date AS "measureDate"
					, height
				FROM  heights
				WHERE user_id = ${ userId }
				ORDER BY
          measure_date DESC
        LIMIT 1`;
			return height;
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" }
	}
};

module.exports = [
  addHeightForCurrentUser,
	allHeightsForCurrentUser,
	deleteHeightForCurrentUserById,
	getHeightForCurrentUserById,
  updateHeightForCurrentUserById,
  lastHeightForCurrentUser,
];
