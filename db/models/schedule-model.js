"use strict";

// Internal Modules
import errorHandling from "../../error-handling.js";
import pool from "../pool.js";
import updateQuery from "./update-query.js";

/*
Fix schema diagram: start_date, end_date
*/

// Exports
async function createSchedule(startDate, endDate, groupId, draftId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            `INSERT INTO schedules (start_date, end_date, groupId, draftId)
            VALUES ($1, $2, $3, $4) RETURNING id;`,
            [ startDate, endDate, groupId, draftId ]
        );

		result.ok = true;
		result.value = queryResult.rows[0].id;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function readSchedule(id) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query("SELECT * FROM schedules WHERE id = $1;", [id]);
		
		if (queryResult.rowCount > 0) {
			result.ok = true;
			result.value = queryResult;
		} else {
			result.ok = false;
			result.message = "Schedule does not exist.";
		}
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function readSchedulesByGroupId(groupId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "SELECT * FROM schedules WHERE group_id = $1;",
            [groupId]
        );

		result.ok = true;
		result.value = queryResult;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function readSchedulesByDraftId(draftId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "SELECT * FROM schedules WHERE draft_id = $1;",
            [draftId]
        );

		result.ok = true;
		result.value = queryResult;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function updateSchedule(id, updates) {
	const result = updateQuery("schedules", {id}, updates);
	
	return result;
}

async function deleteSchedule(id) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query("DELETE FROM schedules WHERE id = $1;", [id]);
		
		if (queryResult.rowCount > 0) {
			result.ok = true;
		} else {
			result.ok = false;
			result.message = "Schedule does not exist.";
		}
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function deleteSchedulesByGroupId(groupId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "DELETE FROM schedules WHERE group_id = $1;",
            [groupId]
        );

		result.ok = true;
		result.value = queryResult;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function deleteSchedulesByDraftId(draftId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "DELETE FROM schedules WHERE draft_id = $1;",
            [draftId]
        );

		result.ok = true
		result.value = queryResult;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

// Production
const scheduleModel = {
    createSchedule,
    readSchedule,
    readSchedulesByGroupId,
    readSchedulesByDraftId,
    updateSchedule,
    deleteSchedulesByGroupId,
    deleteSchedulesByDraftId
};

export default scheduleModel;

// Testing
const testing =
	process.env.NODE_ENV == "test" ?
	{
        createSchedule,
        readSchedule,
        readSchedulesByGroupId,
        readSchedulesByDraftId,
        updateSchedule,
        deleteSchedulesByGroupId,
        deleteSchedulesByDraftId
    }
	: {};
