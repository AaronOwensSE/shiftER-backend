/*
We are placing environment variable configuration in its own file to decouple it from the main
process of the project. Database setup, testing, and potentially other functions are not part of
that process but still need access to environment variables.

Most of our files will import this file, causing the setup function to be called automatically. This
is important because other imports in our files expect environment variables to be set up, and ESM
will attempt to run those files before running any code in the importing file. We don't get the
chance to call setup before environment variables are needed.

However, we also want to export the setup function for use by Jest's globalSetup configuration
option, which searches for the default export and runs it itself, skipping our explicit call below.

Using both methods allows this file to cover both production use and testing.
*/

// =================================================================================================
// External Dependencies
// =================================================================================================
import dotenv from "dotenv";
import url from "url";
import path from "path";

// =================================================================================================
// Commands
// =================================================================================================
setup();

// =================================================================================================
// Public API
// =================================================================================================
export default function setup() {
    /*
    We need to provide an absolute path, even if this file is in the same directory as .env.

    The reason is that dotenv will default, not to the .env file in the directory of the script
    being run, but to the .env file in the working directory from which the script was called.

    Thus, scripts called from arbitrary working directories will fail to find the intended .env
    file, unless an absolute path is provided.
    */

    // Converts URL of this file to a file path.
    const filePath = url.fileURLToPath(import.meta.url);

    // Strips the file path to a directory path.
    const directory = path.dirname(filePath);

    // Combines segments into an absolute path.
    const absolutePath = path.resolve(directory, "./.env");

    dotenv.config({ path: absolutePath });
}
