// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errorHandling from "../../error-handling.js";
import pool from "../pool.js";
import updateQuery from "./update-query.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createParticipation(userId, draftId, turnOrder, passing) {
	let result = new errorHandling.Result();
	
	try {
		await pool.query(
            `INSERT INTO participation (user_id, draft_id, turn_order, passing)
            VALUES ($1, $2, $3, $4);`,
            [ userId, draftId, turnOrder, passing ]
        );

		result.ok = true;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function readParticipation(userId, draftId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "SELECT * FROM participation WHERE user_id = $1 AND draft_id = $2;",
            [ userId, draftId ]
        );
		
		if (queryResult.rowCount > 0) {
			result.ok = true;
			result.value = queryResult;
		} else {
			result.ok = false;
			result.message = "Participation does not exist.";
		}
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function readParticipationByUserId(userId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "SELECT * FROM participation WHERE user_id = $1;",
            [userId]
        );

		result.ok = true;
		result.value = queryResult;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function readParticipationByDraftId(draftId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "SELECT * FROM participation WHERE draft_id = $1;",
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

async function updateParticipation(userId, draftId, updates) {
	const result = await updateQuery(
        "participation", { user_id: userId, draft_id: draftId }, updates
    );
	
	return result;
}

async function deleteParticipation(userId, draftId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "DELETE FROM participation WHERE user_id = $1 AND draft_id = $2;",
            [ userId, draftId ]
        );
		
		if (queryResult.rowCount > 0) {
			result.ok = true;
		} else {
			result.ok = false;
			result.message = "Participation does not exist.";
		}
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function deleteParticipationByUserId(userId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "DELETE FROM participation WHERE user_id = $1;",
            [userId]
        );

		result.ok = true;
		result.value = queryResult;
	} catch (error) {
		result.ok = false;
		result.message = error.message;
	}
	
	return result;
}

async function deleteParticipationByDraftId(draftId) {
	let result = new errorHandling.Result();
	
	try {
		const queryResult = await pool.query(
            "DELETE FROM participation WHERE draft_id = $1;",
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

const participationModel = {
    createParticipation,
    readParticipation,
    readParticipationByUserId,
    readParticipationByDraftId,
    updateParticipation,
    deleteParticipation,
    deleteParticipationByUserId,
    deleteParticipationByDraftId
};

export default participationModel;

export const testing =
	process.env.NODE_ENV == "test" ?
	{
        createParticipation,
        readParticipation,
        readParticipationByUserId,
        readParticipationByDraftId,
        updateParticipation,
        deleteParticipation,
        deleteParticipationByUserId,
        deleteParticipationByDraftId
    }
	: {};
