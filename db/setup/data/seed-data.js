"use strict";

/*
A minimum set of seed data should have:

Users: Sufficient to test others

Sessions: -> 1 active user, 2 inactive users
- 1 expired session
- 1 active session
- 1 user not logged in

Groups: Sufficient to test others

Memberships: -> 3 active users, 2 groups, 3 memberships
- 1 user in 2 groups
- 1 user in no groups
- 1 group with 2 users

Drafts: -> 2 drafts, 2 groups
- 1 active draft
- 1 paused draft
- 2 drafts belonging to the same group

Participation: -> 3 active users, 1 group, 1 draft, 5 participations
- 2 users in the same draft with differing turn orders
- 1 additional user in the same draft who is passing
- 2 users to fill out the second draft

Schedules: -> 3 schedules, 2 groups, 3 drafts
- 2 schedules belonging to the same group and 2 different drafts
- 1 schedule belonging to a different group and a different draft

Shifts: -> 3 shifts, 2 active users, 1 schedule
- 2 overlapping shifts belonging to 2 different users in the same schedule
- 2 non-overlapping shifts in the same schedule
- 1 shift not yet claimed
- 4 shifts to fill out the other 2 schedules

=> 
    3 active users,
    2 inactive users,
    4 sessions,
    2 groups,
    3 memberships,
    3 drafts,
    3 participations,
    3 schedules,
    7 shifts
*/

// Internal Modules
import "../../../setup.js"; // Must be first.
import crypt from "../../../crypt.js";
import userModel from "../../models/user-model.js";
import sessionModel from "../../models/session-model.js";
import groupModel from "../../models/group-model.js";
import membershipModel from "../../models/membership-model.js";
import draftModel from "../../models/draft-model.js";
import participationModel from "../../models/participation-model.js";
import scheduleModel from "../../models/schedule-model.js";
import shiftModel from "../../models/shift-model.js";
import pool from "../../pool.js";

// Constants
const msPerHour = 60 * 60 * 1000;
const msPerDay = 24 * msPerHour;
const date = new Date();

const IN_EIGHT_DAYS = new Date(date.getTime() + 8 * msPerDay);
const IN_SEVEN_DAYS = new Date(date.getTime() + 7 * msPerDay);
const SEVEN_DAYS_AGO = new Date(date.getTime() - 7 * msPerDay);

const NINE_AM = "09:00:00";
const FIVE_PM = "05:00:00";

const ONE_HOUR = "1 hour";

const SHIFT_ONE_START = new Date(date.getTime() + 7 * msPerDay + msPerHour);
const SHIFT_ONE_END = new Date(date.getTime() + 7 * msPerDay + 2 * msPerHour);
const SHIFT_TWO_START = new Date(date.getTime() + 7 * msPerDay + 2 * msPerHour);
const SHIFT_TWO_END = new Date(date.getTime() + 7 * msPerDay + 3 * msPerHour);

// Run
await seedData();
await pool.end();

// Main Function
async function seedData() {
    console.log("Attempting to seed data:");
    console.log();

    const users = [
        {
        id: "user1",
        hash: await crypt.generateHash("user1"),
        name: "User One",
        email: "user1@example.com"
        },

        {
            id: "user2",
            hash: await crypt.generateHash("user2"),
            name: "User Two",
            email: "user2@example.com"
        },

        {
            id: "user3",
            hash: await crypt.generateHash("user3"),
            name: "User Three",
            email: "user3@example.com"
        },

        {
            id: "user4",
            hash: await crypt.generateHash("user4"),
            name: "User Four",
            email: "user4@example.com"
        },

        {
            id: "user5",
            hash: await crypt.generateHash("user5"),
            name: "User Five",
            email: "user5@example.com"
        }
    ];

    await seedUsers(users);
    console.log();

    const sessions = [
        { id: "session1", userId: users[0].id, expires: IN_SEVEN_DAYS },
        { id: "session2", userId: users[1].id, expires: IN_SEVEN_DAYS },
        { id: "session3", userId: users[2].id, expires: IN_SEVEN_DAYS },
        { id: "session4", userId: users[3].id, expires: SEVEN_DAYS_AGO }
    ];

    await seedSessions(sessions);
    console.log();

    const groups = [
        { id: undefined, name: "Group One" },
        { id: undefined, name: "Group Two" }
    ];

    await seedGroups(groups);
    console.log();

    const memberships = [
        { userId: users[0].id, groupId: groups[0].id, admin: true },
        { userId: users[0].id, groupId: groups[1].id, admin: true },
        { userId: users[1].id, groupId: groups[0].id, admin: false },
        { userId: users[2].id, groupId: groups[1].id, admin: false },
        { userId: users[3].id, groupId: groups[0].id, admin: false },
    ];

    await seedMemberships(memberships);
    console.log();

    const drafts = [
        {
            id: undefined,
            startTime: SEVEN_DAYS_AGO,
            endTime: IN_SEVEN_DAYS,
            activeStartTime: NINE_AM,
            activeEndTime: FIVE_PM,
            turnDuration: ONE_HOUR,
            paused: false,
            groupId: groups[0].id
        },

        {
            id: undefined,
            startTime: SEVEN_DAYS_AGO,
            endTime: IN_SEVEN_DAYS,
            activeStartTime: NINE_AM,
            activeEndTime: FIVE_PM,
            turnDuration: ONE_HOUR,
            paused: false,
            groupId: groups[0].id
        },

        {
            id: undefined,
            startTime: SEVEN_DAYS_AGO,
            endTime: IN_SEVEN_DAYS,
            activeStartTime: NINE_AM,
            activeEndTime: FIVE_PM,
            turnDuration: ONE_HOUR,
            paused: true,
            groupId: groups[1].id
        }
    ];

    await seedDrafts(drafts);
    console.log();

    const participation = [
        { userId: users[0].id, draftId: drafts[0].id, turnOrder: 0, passing: false },
        { userId: users[1].id, draftId: drafts[0].id, turnOrder: 1, passing: false },
        { userId: users[3].id, draftId: drafts[0].id, turnOrder: 2, passing: true },
        { userId: users[0].id, draftId: drafts[1].id, turnOrder: 0, passing: false },
        { userId: users[3].id, draftId: drafts[1].id, turnOrder: 1, passing: false },
        { userId: users[0].id, draftId: drafts[2].id, turnOrder: 0, passing: false },
        { userId: users[2].id, draftId: drafts[2].id, turnOrder: 1, passing: false },
    ];

    await seedParticipation(participation);
    console.log();

    const schedules = [
        {
            startDate: IN_SEVEN_DAYS,
            endDate: IN_EIGHT_DAYS,
            groupId: drafts[0].groupId,
            draftId: drafts[0].id
        },

        {
            startDate: IN_SEVEN_DAYS,
            endDate: IN_EIGHT_DAYS,
            groupId: drafts[1].groupId,
            draftId: drafts[1].id
        },

        {
            startDate: IN_SEVEN_DAYS,
            endDate: IN_EIGHT_DAYS,
            groupId: drafts[2].groupId,
            draftId: drafts[2].id
        }
    ];

    await seedSchedules(schedules);
    console.log();

    // userId to be updated after creation during seedShifts. Not all shifts should have a user ID.
    const shifts = [
        {
            startTime: SHIFT_ONE_START,
            endTime: SHIFT_ONE_END,
            scheduleId: schedules[0].id,
            userId: users[0].id
        },

        {
            startTime: SHIFT_ONE_START,
            endTime: SHIFT_ONE_END,
            scheduleId: schedules[0].id,
            userId: users[1].id
        },

        { startTime: SHIFT_TWO_START, endTime: SHIFT_TWO_END, scheduleId: schedules[0].id },

        {
            startTime: SHIFT_ONE_START,
            endTime: SHIFT_ONE_END,
            scheduleId: schedules[1].id,
            userId: users[0].id
        },

        {
            startTime: SHIFT_TWO_START,
            endTime: SHIFT_TWO_END,
            scheduleId: schedules[1].id,
            userId: users[3].id
        },

        {
            startTime: SHIFT_ONE_START,
            endTime: SHIFT_ONE_END,
            scheduleId: schedules[2].id,
            userId: users[2].id
        },
        
        { startTime: SHIFT_TWO_START, endTime: SHIFT_TWO_END, scheduleId: schedules[2].id },
    ];

    await seedShifts(shifts);
}

// Helper Functions
async function seedUsers(users) {
    console.log("Attempting to seed users:");

    for (let i = 0, result; i < users.length; i++) {
        result = await userModel.createUser(
            users[i].id, users[i].hash, users[i].name, users[i].email
        );

        if (result.ok) {
            console.log(`Create user ${users[i].id} complete.`);
        } else {
            console.log(`Create user ${users[i].id} failed: ${result.message}`);
        }
    }
}

async function seedSessions(sessions) {
    console.log("Attempting to seed sessions:");

    for (let i = 0, result; i < sessions.length; i++) {
        result = await sessionModel.createSession(
            sessions[i].id, sessions[i].userId, sessions[i].expires
        );

        if (result.ok) {
            console.log(`Create session ${sessions[i].id} complete.`);
        } else {
            console.log(`Create session ${sessions[i].id} failed: ${result.message}`);
        }
    }
}

async function seedGroups(groups) {
    console.log("Attempting to seed groups:");

    for (let i = 0, result; i < groups.length; i++) {
        result = await groupModel.createGroup(groups[i].name);

        if (result.ok) {
            groups[i].id = result.value;
            console.log(`Create group ${groups[i].id} complete.`);
        } else {
            console.log(`Create group ${groups[i].name} failed: ${result.message}`);
        }
    }
}

async function seedMemberships(memberships) {
    console.log("Attempting to seed memberships:");

    for (let i = 0, result; i < memberships.length; i++) {
        result = await membershipModel.createMembership(
            memberships[i].userId, memberships[i].groupId, memberships[i].admin
        );

        if (result.ok) {
            console.log(
                `Create membership ${memberships[i].userId}/${memberships[i].groupId} complete.`
            );
        } else {
            console.log(
                `Create membership ${memberships[i].userId}/${memberships[i].groupId} failed: ${result.message}`
            );
        }
    }
}

async function seedDrafts(drafts) {
    console.log("Attempting to seed drafts:");

    for (let i = 0, result; i < drafts.length; i++) {
        result = await draftModel.createDraft(
            drafts[i].startTime,
            drafts[i].endTime,
            drafts[i].activeStartTime,
            drafts[i].activeEndTime,
            drafts[i].turnDuration,
            drafts[i].paused,
            drafts[i].groupId
        );

        if (result.ok) {
            drafts[i].id = result.value;
            console.log(`Create draft ${drafts[i].id} complete.`);
        } else {
            console.log(
                `Create draft ${drafts[i].startTime} - ${drafts[i].endTime} failed: ${result.message}`
            );
        }
    }
}

async function seedParticipation(participation) {
    console.log("Attempting to seed participation:");

    for (let i = 0, result; i < participation.length; i++) {
        result = await participationModel.createParticipation(
            participation[i].userId,
            participation[i].draftId,
            participation[i].turnOrder,
            participation[i].passing
        );

        if (result.ok) {
            console.log(
                `Create participation ${participation[i].userId}/${participation[i].draftId} complete.`
            );
        } else {
            console.log(
                `Create participation ${participation[i].userId}/${participation[i].draftId} failed: ${result.message}`
            );
        }
    }
}

async function seedSchedules(schedules) {
    console.log("Attempting to seed schedules:");

    for (let i = 0, result; i < schedules.length; i++) {
        result = await scheduleModel.createSchedule(
            schedules[i].startDate, schedules[i].endDate, schedules[i].groupId, schedules[i].draftId
        );

        if (result.ok) {
            schedules[i].id = result.value;
            console.log(`Create schedule ${schedules[i].id} complete.`);
        } else {
            console.log(`Create schedule ${schedules[i].startDate} - ${schedules[i].endDate} failed: ${result.message}`);
        }
    }
}

async function seedShifts(shifts) {
    console.log("Attempting to seed shifts:");

    for (let i = 0, result; i < shifts.length; i++) {
        result = await shiftModel.createShift(
            shifts[i].startTime, shifts[i].endTime, shifts[i].scheduleId
        );

        if (result.ok) {
            shifts[i].id = result.value;
            console.log(`Create shift ${shifts[i].id} complete.`);

            if (shifts[i].userId) {
                result = await shiftModel.updateShift(shifts[i].id, { user_id: shifts[i].userId });

                if (result.ok) {
                    console.log(`Update shift ${shifts[i].id} complete.`);
                } else {
                    console.log(`Update shift ${shifts[i].id}`);
                }
            }
        } else {
            console.log(`Create shift ${shifts[i].startTime} - ${shifts[i].endTime} failed: ${result.message}`);
        }
    }
}
