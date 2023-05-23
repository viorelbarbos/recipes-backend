import IUser from '../database/interfaces/IUser';
import IResponseStructure from '../utils/models/generic/IResponseStructure';
import {
    addUser,
    getUserByEmail,
    getUserById,
    getUsers,
    updateUser,
    deleteUser,
} from '../services/mongoDB/user.service';
import { compareHashPassword, hashPassword } from '../utils/methods/bcrypt';
import { Router, Response, Request } from 'express';
import {
    createUser,
    deleteUserByIdNeo,
    getAllUsersNeo,
    getUserByEmailNeo,
    getUserByIdNeo,
    updateUserByIdNeo,
} from '../services/neo4j/user.service';

const router = Router();

/**
 * @path /v1/user/
 * Add a new user to the database.
 * @body user: The user to add to the database.
 * @response 201: The user that was added to the database.
 * @response 400: The user was not added to the database.
 */

router.post('/', async (req: Request, res: Response<IResponseStructure>) => {
    try {
        const user: IUser = req.body.user;
        const dataBaseType: string = req.body.dataBaseType;

        if (!dataBaseType)
            return res.status(400).json({
                success: false,
                message: 'Please specify the database type',
            });

        if (
            !user ||
            !user.email ||
            !user.password ||
            !user.firstName ||
            !user.lastName
        )
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields',
            });

        let userExists;
        if (dataBaseType === 'mongoDB') {
            //check if user exists
            userExists = await getUserByEmail(user.email);
        } else if (dataBaseType === 'neo4j') {
            //check if user exists
            userExists = await getUserByEmailNeo(user.email);
        }
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        //hash password
        user.password = await hashPassword(user.password);

        let newUser;
        //add user to database in mongoDB
        if (dataBaseType === 'mongoDB') newUser = await addUser(user);
        //add user to database in neo4j
        else if (dataBaseType === 'neo4j') newUser = await createUser(user);

        if (!newUser)
            return res.status(400).json({
                success: false,
                message: 'User was not added',
            });

        return res.status(201).json({
            success: true,
            message: 'User added successfully',
            data: {
                newUser: {
                    firstName: newUser?.firstName,
                    lastName: newUser?.lastName,
                    email: newUser?.email,
                    _id: newUser?._id,
                },
            },
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @path /v1/user/login
 * Login a user.
 * @body email: The email and password of the user to login.
 * @response 200: The user that was logged in.
 * @response 400: The user was not logged in.
 */

router.post(
    '/login',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const { email, password } = req.body;

            const dataBaseType: string = req.body.dataBaseType;

            if (!email || !password)
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all fields',
                });

            let user;
            //check if user exists
            if (dataBaseType === 'mongoDB') user = await getUserByEmail(email);
            else if (dataBaseType === 'neo4j')
                user = await getUserByEmailNeo(email);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'User does not exist',
                });
            }

            //check if password is correct
            const isMatch = await compareHashPassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }

            let authUser;
            //get user from database in mongoDB
            if (dataBaseType === 'mongoDB')
                authUser = await getUserById(user._id!);
            //get user from database in neo4j
            else if (dataBaseType === 'neo4j')
                authUser = await getUserByIdNeo(Number(user._id!));

            return res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                data: { authUser },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

/**
 * @path /v1/user/dataBaseType/:dataBaseType
 * Get all users from the database.
 * @response 200: All users from the database.
 * @response 400: No users were found in the database.
 */

router.get(
    '/dataBaseType/:dataBaseType',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const dataBaseType: string = req.params.dataBaseType;

            let users;
            //get all users from database in mongoDB
            if (dataBaseType === 'mongoDB') users = await getUsers();
            //get all users from database in neo4j
            else if (dataBaseType === 'neo4j') users = await getAllUsersNeo();
            return res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: { users },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

/**
 * @path /v1/user/:id/:dataBaseType
 * Get a user from the database by their id.
 * @param id The id of the user to get from the database.
 * @response 200: The user that was retrieved from the database.
 * @response 400: The user was not retrieved from the database.
 */

router.get(
    '/:id/:dataBaseType',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;
            const dataBaseType: string = req.params.dataBaseType;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'No id was provided',
                });
            }

            let user;
            //get user from database in mongoDB
            if (dataBaseType === 'mongoDB') user = await getUserById(id);
            //get user from database in neo4j
            else if (dataBaseType === 'neo4j')
                user = await getUserByIdNeo(Number(id));

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'User does not exist',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: { user },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

/**
 * @path /v1/user/:id/
 * Update a user in the database by their id.
 * @param id The id of the user to update in the database.
 * @body user: The user to update in the database.
 * @response 200: The user that was updated in the database.
 * @response 400: The user was not updated in the database.
 */

router.put('/:id', async (req: Request, res: Response<IResponseStructure>) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'No id was provided',
            });
        }

        const user: IUser = req.body.user;
        const dataBaseType: string = req.body.dataBaseType;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user was provided',
            });
        }

        let updatedUser;
        //update user in database in mongoDB
        if (dataBaseType === 'mongoDB')
            updatedUser = await updateUser(id, user);
        //update user in database in neo4j
        else if (dataBaseType === 'neo4j')
            updatedUser = await updateUserByIdNeo(Number(id), user);

        if (!updatedUser) {
            return res.status(400).json({
                success: false,
                message: 'User was not updated',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: { updatedUser },
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @path /v1/user/:id/:dataBaseType
 * Delete a user from the database by their id.
 * @param id The id of the user to delete from the database.
 * @response 200: The user that was deleted from the database.
 * @response 400: The user was not deleted from the database.
 */

router.delete(
    '/:id/:dataBaseType',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;
            const dataBaseType: string = req.params.dataBaseType;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'No id was provided',
                });
            }
            let deletedUser;
            //delete user from database in mongoDB
            if (dataBaseType === 'mongoDB') deletedUser = await deleteUser(id);
            //delete user from database in neo4j
            else if (dataBaseType === 'neo4j')
                deletedUser = await deleteUserByIdNeo(Number(id));

            if (!deletedUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User was not deleted',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'User deleted successfully',
                data: { deletedUser },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

/**
 * @path /v1/user/logout
 * Logout a user.
 * @response 200: The user that was logged out.
 * @response 400: The user was not logged out.
 */

router.post(
    '/logout',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            return res.status(200).json({
                success: true,
                message: 'User logged out successfully',
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

/**
 * @path /v1/user/email
 * get a user by their email.
 * @body email: The email of the user to get from the database.
 * @response 200: The user that was retrieved from the database.
 * @response 400: The user was not retrieved from the database.
 */

router.post(
    '/email',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const email = req.body.email;
            const dataBaseType: string = req.body.dataBaseType;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'No email was provided',
                });
            }

            let user;
            //get user from database in mongoDB
            if (dataBaseType === 'mongoDB') user = await getUserByEmail(email);
            //get user from database in neo4j
            else if (dataBaseType === 'neo4j')
                user = await getUserByEmailNeo(email);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'User does not exist',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: { user },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
);

export default router;
