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
    getUserByEmailNeo,
    getUserByIdNeo,
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
        const neo4jUser = await createUser(user);
        console.log(neo4jUser?.summary);
        //check if user exists
        const userExists = await getUserByEmail(user.email);
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        //hash password
        user.password = await hashPassword(user.password);

        //add user to database in mongoDB
        const newUser = await addUser(user);

        //add user to database in neo4j

        return res.status(201).json({
            success: true,
            message: 'User added successfully',
            data: {
                newUser: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    _id: newUser._id,
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
            if (!email || !password)
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all fields',
                });

            //check if user exists
            const user = await getUserByEmail(email);
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

            const authUser = await getUserById(user._id!);

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
 * @path /v1/user/
 * Get all users from the database.
 * @response 200: All users from the database.
 * @response 400: No users were found in the database.
 */

router.get('/', async (req: Request, res: Response<IResponseStructure>) => {
    try {
        const users = await getUsers();
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
});

/**
 * @path /v1/user/:id
 * Get a user from the database by their id.
 * @param id The id of the user to get from the database.
 * @response 200: The user that was retrieved from the database.
 * @response 400: The user was not retrieved from the database.
 */

router.get('/:id', async (req: Request, res: Response<IResponseStructure>) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'No id was provided',
            });
        }

        const user = await getUserById(id);
        const neo4jUser = await getUserByIdNeo(Number(id));
        console.log(neo4jUser);

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
});

/**
 * @path /v1/user/:id
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

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user was provided',
            });
        }

        const updatedUser = await updateUser(id, user);

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
 * @path /v1/user/:id
 * Delete a user from the database by their id.
 * @param id The id of the user to delete from the database.
 * @response 200: The user that was deleted from the database.
 * @response 400: The user was not deleted from the database.
 */

router.delete(
    '/:id',
    async (req: Request, res: Response<IResponseStructure>) => {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'No id was provided',
                });
            }

            const deletedUser = await deleteUser(id);

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

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'No email was provided',
                });
            }

            const user = await getUserByEmail(email);
            const neo4jUser = await getUserByEmailNeo(email);

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
