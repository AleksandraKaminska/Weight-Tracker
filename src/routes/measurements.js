"use strict";

const addMeasurements = {
	method: "GET",
	path: "/add-measurement",
	handler: ( request, h ) => {
		return h.view( "addMeasurement", { title: "Add Measurement" } );
	}
};

const addHeight = {
	method: "GET",
	path: "/add-height",
	handler: ( request, h ) => {
		return h.view( "addHeight", { title: "Add Height" } );
	}
};

const addSteps = {
	method: "GET",
	path: "/add-steps",
	handler: ( request, h ) => {
		return h.view( "addSteps", { title: "Add Steps" } );
	}
};

const addWater = {
	method: "GET",
	path: "/add-water",
	handler: ( request, h ) => {
		return h.view( "addWater", { title: "Add Water" } );
	}
};

const addSleep = {
	method: "GET",
	path: "/add-sleep",
	handler: ( request, h ) => {
		return h.view( "addSleep", { title: "Add Sleep" } );
	}
};

const weightMeasurements = {
	method: "GET",
	path: "/weight-list",
	handler: ( request, h ) => {
		return h.view( "weightList", { title: "Measurements" } );
	}
};

const waterMeasurements = {
	method: "GET",
	path: "/water-list",
	handler: ( request, h ) => {
		return h.view( "waterList", { title: "Water Measurements" } );
	}
};

const stepsMeasurements = {
	method: "GET",
	path: "/steps-list",
	handler: ( request, h ) => {
		return h.view( "stepsList", { title: "Steps" } );
	}
};

module.exports = [
  weightMeasurements,
  waterMeasurements,
  stepsMeasurements,
  addMeasurements,
  addHeight,
  addSteps,
  addWater,
  addSleep,
];
