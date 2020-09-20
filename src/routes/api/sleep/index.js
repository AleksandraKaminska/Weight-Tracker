"use strict";

const boom = require( "@hapi/boom" );
const joi = require( "@hapi/joi" );

// add a new sleep measurement for the current user
const addSleepMeasurementForCurrentUser = {
	method: "POST",
	path: "/api/sleep-measurements",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const { start_at, end_at, minutes } = request.payload;
      const res = await h.sql`
        INSERT INTO sleep_measurements
        ( user_id, start_at, end_at, minutes )
				VALUES
				( ${ userId }, ${ start_at }, ${ end_at }, ${ minutes } )

        RETURNING
          id,
          start_at,
          end_at,
          minutes
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
				minutes: joi.number()
			} )
		}
	}
};

// retrieve all sleep measurements for the current user
const allSleepMeasurementsForCurrentUser = {
	method: "GET",
	path: "/api/sleep-measurements",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
      const measurements = await h.sql`
        SELECT
          id,
          start_at,
          end_at,
          minutes
				FROM sleep_measurements
				WHERE user_id = ${ userId }
        ORDER BY end_at
      `;
			return measurements;
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" }
	}
};

// delete a measurement for the current user by id
const deleteSleepMeasurementForCurrentUserById = {
	method: "DELETE",
	path: "/api/sleep-measurements/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
      const res = await h.sql`
        DELETE
				FROM sleep_measurements
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

// get one measurement for the current user by id
const getSleepMeasurementForCurrentUserById = {
	method: "GET",
	path: "/api/sleep-measurements/{id}",
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
          minutes
        FROM sleep_measurements
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

// update a measurement for the current user by id
const updateSleepMeasurementForCurrentUserById = {
	method: "PUT",
	path: "/api/sleep-measurements/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const { measureDate, start_at, end_at, minutes } = request.payload;
      const res = await h.sql`
        UPDATE sleep_measurements
        SET
          start_at = ${ start_at },
          end_at = ${ end_at },
					minutes = ${ minutes }
				WHERE id = ${ id }
				AND user_id = ${ userId }

				RETURNING
				  id,
          start_at,
          end_at,
          minutes
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
				minutes: joi.number()
			} )
		}
	}
};

// get today measurement for the current user
const getTodaySleepMeasurementForCurrentUser = {
	method: "GET",
	path: "/api/sleep-measurements/today",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
      const measurement = await h.sql`
        SELECT SUM (minutes) AS total_minutes
				FROM sleep_measurements
				WHERE user_id = ${ userId } AND end_at > now() - interval '1 day';
      `;
			return measurement;
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
  addSleepMeasurementForCurrentUser,
	allSleepMeasurementsForCurrentUser,
	deleteSleepMeasurementForCurrentUserById,
	getSleepMeasurementForCurrentUserById,
  updateSleepMeasurementForCurrentUserById,
  getTodaySleepMeasurementForCurrentUser,
];
