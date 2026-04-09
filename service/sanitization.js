// =================================================================================================
// Public API
// =================================================================================================
function sanitizedObject(inputObject, allowedKeys) {
    const allowedKeysSet = new Set(allowedKeys);            // Hash set for O(1) lookup.
    const inputObjectKeys = Object.keys(inputObject);       // Object's own keys only.
    let sanitizedObject = {};

    for (const key of inputObjectKeys) {
        if (allowedKeysSet.has(key)) {
            sanitizedObject[key] = inputObject[key];
        }
    }

    return sanitizedObject;
}
const sanitization = { sanitizedObject };
export default sanitization;
