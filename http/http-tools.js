// =================================================================================================
// Public API
// =================================================================================================
function getBearerToken(req) {
    const bearerTokenHeader = req.header("Authorization");  // Format: "Bearer token"
    const bearerTokenWords = bearerTokenHeader.split(" ");
    const bearerToken = bearerTokenWords[1];

    return bearerToken;
}

const httpTools = { getBearerToken };
export default httpTools;
