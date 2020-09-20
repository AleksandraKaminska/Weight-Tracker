"use strict";

const boom = require( "@hapi/boom" );
const joi = require( "@hapi/joi" );

// add a new water measurement for the current user
const addWaterMeasurementForCurrentUser = {
	method: "POST",
	path: "/api/water-measurements",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const { measureDate, milliliters } = request.payload;
      const res = await h.sql`
        INSERT INTO water_measurements
				( user_id, measure_date, milliliters )
				VALUES
				( ${ userId }, ${ measureDate }, ${ milliliters } )

        RETURNING
          id,
          measure_date AS "measureDate",
          milliliters
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
        measureDate: joi.date(),
				milliliters: joi.number()
			} )
		}
	}
};

// retrieve all water measurements for the current user
const allWaterMeasurementsForCurrentUser = {
	method: "GET",
	path: "/api/water-measurements",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
      const water_measurements = await h.sql`
        SELECT
          id,
          measure_date AS "measureDate",
          milliliters
				FROM  water_measurements
				WHERE user_id = ${ userId }
        ORDER BY measure_date
      `;
			return water_measurements;
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" }
	}
};

// delete a water measurement for the current user by id
const deleteWaterMeasurementForCurrentUserById = {
	method: "DELETE",
	path: "/api/water-measurements/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const res = await h.sql`DELETE
				FROM  water_measurements
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

// get one water measurement for the current user by id
const getWaterMeasurementForCurrentUserById = {
	method: "GET",
	path: "/api/water-measurements/{id}",
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
          measure_date AS "measureDate",
          milliliters
        FROM water_measurements
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

// update a water measurement for the current user by id
const updateWaterMeasurementForCurrentUserById = {
	method: "PUT",
	path: "/api/water-measurements/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const { measureDate, milliliters } = request.payload;
      const res = await h.sql`
        UPDATE water_measurements
        SET
          measure_date = ${ measureDate },
          milliliters = ${ milliliters }
				WHERE id = ${ id }
				AND user_id = ${ userId }

				RETURNING
				  id,
          measure_date AS "measureDate",
          milliliters
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
        measureDate: joi.date(),
				milliliters: joi.number()
			} )
		}
	}
};

// get today water measurement for the current user
const getTodayWaterMeasurementForCurrentUser = {
	method: "GET",
	path: "/api/water-measurements/today",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
      const measurement = await h.sql`
        SELECT SUM (milliliters) AS total_milliliters
				FROM water_measurements
				WHERE user_id = ${ userId } AND measure_date > now() - interval '1 day';
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
  addWaterMeasurementForCurrentUser,
	allWaterMeasurementsForCurrentUser,
	deleteWaterMeasurementForCurrentUserById,
	getWaterMeasurementForCurrentUserById,
  updateWaterMeasurementForCurrentUserById,
  getTodayWaterMeasurementForCurrentUser,
];
