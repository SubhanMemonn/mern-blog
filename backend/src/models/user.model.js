import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken"
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default:
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.passwordCheck = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function () {
    return Jwt.sign({
        id: this._id,
        isAdmin: this.isAdmin
    },
        process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRY
    }
    )
}
const User = mongoose.model('User', userSchema);

export default User;
