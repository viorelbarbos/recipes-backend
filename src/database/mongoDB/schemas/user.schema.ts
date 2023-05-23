import mongoose from 'mongoose';
import IUser from '../../interfaces/IUser';

interface IUserDoc extends mongoose.Document, Omit<IUser, '_id'> {}

interface IUserSchema extends mongoose.Model<IUserDoc> {
    add(user: IUser): IUserDoc;
}

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
    },
});

UserSchema.statics.add = (user: IUser) => {
    return new User(user);
};

const User = mongoose.model<IUserDoc, IUserSchema>('Users', UserSchema);

export { User, IUserDoc };
