import IUser from '../../database/interfaces/IUser';
import { User } from '../../database/mongoDB/schemas/user.schema';

/**
 * Add a new user to the database.
 * @param user The user to add to the database.
 * @returns The user that was added to the database.
 */

export const addUser = async (user: IUser) => {
    const newUser = User.add(user);
    return await newUser.save();
};

/**
 * Get a user from the database by their email.
 * @param email The email of the user to get from the database.
 * @returns The user that was retrieved from the database.
 */

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email });
};

/**
 * Get a user from the database by their id.
 * @param id The id of the user to get from the database.
 * @returns The user that was retrieved from the database.
 */

export const getUserById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id).select('-password');
};

/**
 * Get all users from the database.
 * @returns All users from the database.
 */

export const getUsers = async (): Promise<IUser[]> => {
    return await User.find().select('-password');
};

/**
 * Update a user in the database.
 * @param id The id of the user to update in the database.
 * @param user The user to update in the database.
 * @returns The user that was updated in the database.
 */

export const updateUser = async (
    id: string,
    user: IUser
): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(id, user, { new: true }).select(
        '-password'
    );
};

/**
 * Delete a user from the database.
 * @param id The id of the user to delete from the database.
 * @returns The user that was deleted from the database.
 */

export const deleteUser = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(id);
};
