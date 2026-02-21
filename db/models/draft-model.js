// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errorHandling from "../../error-handling.js";
import pool from "../pool.js";
import updateQuery from "./update-query.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createDraft(
	startTime,
	endTime,
	activeStartTime,
	activeEndTime,
	turnDuration,
	paused,
	groupId
) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(`
			INSERT INTO drafts (
				start_time,
				end_time,
				active_start_time,
				active_end_time,
				turn_duration,
				paused,
				group_id
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING (id);`,
			[ startTime, endTime, activeStartTime, activeEndTime, turnDuration, paused, groupId ]
		);
		
		result.ok = true;
		result.value = queryResult.rows[0].id;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function readDraft(id) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query("SELECT * FROM drafts WHERE id = $1;", [id]);
		
		if (queryResult.rowCount > 0) {
			result.ok = true;
			result.value = queryResult;
		} else {
			result.ok = false;
			result.message = "Draft does not exist.";
		}
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function readDraftsByGroupId(groupId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "SELECT * FROM drafts WHERE group_id = $1;",
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

async function updateDraft(id, updates) {
	const result = updateQuery("drafts", {id}, updates);
	
	return result;
}

async function deleteDraft(id) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query("DELETE FROM drafts WHERE id = $1;", [id]);
		
		if (queryResult.rowCount > 0) {
			result.ok = true;
		} else {
			result.ok = false;
			result.message = "Draft does not exist.";
		}
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function deleteDraftsByGroupId(groupId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query("DELETE FROM drafts WHERE group_id = $1;", [groupId]);
		result.ok = true;
		result.value = queryResult;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

const draftModel = {
    createDraft,
    readDraft,
    readDraftsByGroupId,
    updateDraft,
    deleteDraft,
    deleteDraftsByGroupId
};

export default draftModel;

export const testing =
	process.env.NODE_ENV == "test" ?
	{
        createDraft,
        readDraft,
        readDraftsByGroupId,
        updateDraft,
        deleteDraft,
        deleteDraftsByGroupId
    }
	: {};
