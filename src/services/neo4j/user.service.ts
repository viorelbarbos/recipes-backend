import { Driver, QueryResult, Session } from 'neo4j-driver';
import neo4jConnect from '../../database/neo4jConnect';
import IUser from '../../database/interfaces/IUser';

// Define your Neo4j connection details
const driver: Driver = neo4jConnect()!;

const session: Session = driver.session();

/**
 *  Create a new user
 * @param user  - User object
 * @returns   - QueryResult
 */
export const createUser = async (
    user: IUser
): Promise<QueryResult | undefined> => {
    const query = `
      CREATE (user:User { firstName: $firstName, lastName: $lastName,email: $email, password: $password })
    `;

    const { firstName, lastName, email, password } = user;

    return await session.run(query, {
        firstName,
        lastName,
        email,
        password,
    });
};
/**
 *  Get user by email
 * @param email  - User email
 * @returns  - User object
 */
export const getUserByEmailNeo = async (
    email: string
): Promise<IUser | undefined> => {
    const query = `MATCH (user:User{email: $email }) RETURN {_id: ID(user), firstName: user.firstName, lastName: user.lastName, email:user.email, password:user.password} as user LIMIT 1`;
    const result = await session.run(query, { email });

    return {
        _id: result.records[0].get('user')._id.low,
        firstName: result.records[0].get('user').firstName,
        lastName: result.records[0].get('user').lastName,
        email: result.records[0].get('user').email,
        password: result.records[0].get('user').password,
    };
};

/**
 * Delete user by email
 * @param email  - User email
 * @returns  - QueryResult
 */

export const deleteUserByEmailNeo = async (
    email: string
): Promise<QueryResult | undefined> => {
    const query = `
        MATCH (user:User { email: $email })
        DELETE user
        `;
    return await session.run(query, { email });
};

/**
 * Update user by email
 * @param email  - User email
 * @param user  - User object
 * @returns  - QueryResult
 */

export const updateUserByEmailNeo = async (
    email: string,
    user: IUser
): Promise<QueryResult | undefined> => {
    const query = `
        MATCH (user:User { email: $email })
        SET user.firstName = $firstName, user.lastName = $lastName, user.email = $email, user.password = $password
        RETURN user
        `;
    const { firstName, lastName, password } = user;
    return await session.run(query, {
        firstName,
        lastName,
        email,
        password,
    });
};

/**
 * Get user by id
 * @param id  - User id
 * @returns  - User object
 */
export const getUserByIdNeo = async (
    id: number
): Promise<Omit<IUser, 'password'> | undefined> => {
    const query = `MATCH (user:User) WHERE ID(user) = $id RETURN {_id: ID(user), firstName: user.firstName, lastName: user.lastName, email:user.email} as user LIMIT 1`;
    const result = await session.run(query, { id });

    return {
        _id: result.records[0].get('user')._id.low,
        firstName: result.records[0].get('user').firstName,
        lastName: result.records[0].get('user').lastName,
        email: result.records[0].get('user').email,
    };
};

/**
 * Close Neo4j session
 * @returns  - void
 * @description - Close Neo4j session
 */
export const sessionClose = (): void => {
    session.close();
    driver.close();
};