import passport from "passport"
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
mongoose.connect('mongodb://localhost/samuraiZidane');

const Schema = mongoose.Schema;


export type UserDocument = mongoose.Document & {
    username: String
};

const userSchema = new Schema({
    username: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model<UserDocument>("User", userSchema);
