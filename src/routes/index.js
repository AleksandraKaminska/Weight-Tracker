"use strict";

const path = require( "path" );
const auth = require( "./auth" );
const measurements = require( "./measurements" );
const apiWeight = require( "./api/weight" );
const apiHeight = require( "./api/height" );
const apiWater = require( "./api/water" );
const apiSteps = require( "./api/steps" );
const apiSleep = require( "./api/sleep" );

const home = {
	method: "GET",
	path: "/",
	options: {
		auth: {
			mode: "try"
		},
		handler: ( request, h ) => {
			return h.view( "index", { title: "Home" } );
		}
	}
};

const staticAssets = {
	method: "GET",
	path: "/assets/{param*}",
	handler: {
		directory:{
			path: path.join( __dirname, "..", "assets" )
		}
	},
	options: { auth: false }
};

const error404 = {
	method: "*",
	path: "/{any*}",
	handler: ( request, h ) => h.view( "404", { title: "Not Found" } ).code( 404 ),
	options: { auth: false }
};

module.exports = [
	home,
	staticAssets,
  error404
].concat( auth, measurements, apiWeight, apiHeight, apiWater, apiSteps, apiSleep );
