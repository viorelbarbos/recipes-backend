import bcrypt from 'bcrypt';

/**
 *
 * Asynchronously hash a password .
 *
 * @param password password a string.
 * @returns the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
};

/**
 *
 * Asynchronously compare passwords .
 *
 * @param userPassword the user password.
 * @param databasePassword the password from the database.
 * @returns true if the passwords match or false if not.
 */
export const compareHashPassword = async (
    userPassword: string,
    databasePassword: string
): Promise<boolean> => {
    return await bcrypt.compare(userPassword, databasePassword);
};
