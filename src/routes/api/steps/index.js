"use strict";

const boom = require( "@hapi/boom" );
const joi = require( "@hapi/joi" );

// add steps for the current user
const addStepsForCurrentUser = {
	method: "POST",
	path: "/api/steps",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const { steps, start_at, end_at } = request.payload;
      const res = await h.sql`
        INSERT INTO steps
        ( user_id, start_at, end_at, steps )
				VALUES
        ( ${ userId }, ${ start_at }, ${ end_at }, ${ steps } )

        RETURNING
          id,
          steps,
          start_at,
          end_at
      `;
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
        start_at: joi.date(),
        end_at: joi.date(),
        steps: joi.number(),
			} )
		}
	}
};

// retrieve all steps for the current user
const allStepsForCurrentUser = {
	method: "GET",
	path: "/api/steps",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
      const steps = await h.sql`
        SELECT
          id,
          start_at,
          end_at,
          steps
				FROM steps
				WHERE user_id = ${ userId }
        ORDER BY end_at
      `;
			return steps;
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" }
	}
};

// delete steps for the current user by id
const deleteStepsForCurrentUserById = {
	method: "DELETE",
	path: "/api/steps/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
      const res = await h.sql`
        DELETE
				FROM steps
        WHERE id = ${ id } AND user_id = ${ userId }
      `;
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

// get steps for the current user by id
const getStepsForCurrentUserById = {
	method: "GET",
	path: "/api/steps/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
      const res = await h.sql`
        SELECT
          id,
          start_at,
          end_at,
          steps
        FROM steps
        WHERE user_id = ${ userId } AND id = ${ id }
      `;
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

// update steps for the current user by id
const updateStepsForCurrentUserById = {
	method: "PUT",
	path: "/api/steps/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
      const id = request.params.id;
			const { start_at, end_at, steps } = request.payload;
      const res = await h.sql`
        UPDATE steps
        SET
          start_at = ${ start_at },
          end_at = ${ end_at },
          steps = ${ steps }
				WHERE id = ${ id }
				AND user_id = ${ userId }

        RETURNING
          id,
          start_at,
          end_at,
          steps
      `;
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
        start_at: joi.date(),
        end_at: joi.date(),
				steps: joi.number()
			} )
		}
	}
};

// get today steps for the current user
const getTodayStepsForCurrentUser = {
	method: "GET",
	path: "/api/steps/today",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
      const steps = await h.sql`
        SELECT SUM (steps) AS total_steps
				FROM steps
				WHERE user_id = ${ userId } AND end_at > now() - interval '1 day';
      `;
			return steps;
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
  addStepsForCurrentUser,
	allStepsForCurrentUser,
	deleteStepsForCurrentUserById,
	getStepsForCurrentUserById,
  updateStepsForCurrentUserById,
  getTodayStepsForCurrentUser
];
