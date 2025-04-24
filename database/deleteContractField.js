import sqlite from 'better-sqlite3';
import { sunriseDB } from '../helpers/database.helpers.js';
export default function deleteContractField(contractId, contractTypeFieldId, user, connectedDatabase) {
    const database = connectedDatabase ?? sqlite(sunriseDB);
    const result = database
        .prepare(`update ContractFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where contractId = ?
        and contractTypeFieldId = ?`)
        .run(user.userName, Date.now(), contractId, contractTypeFieldId);
    if (connectedDatabase === undefined) {
        database.close();
    }
    return result.changes > 0;
}
