"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validators_1 = require("../common/validators");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    password: {
        type: String,
        select: true,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validators_1.validateCPF,
            message: '{PATH}: Invalid CPF({VALUE})'
        }
    },
    profiles: {
        type: [String],
        required: false
    }
});
UserSchema.statics.findByEmail = function (email, projection) {
    return this.findOne({ email }, projection);
};
UserSchema.methods.matches = function (password) {
    return bcrypt.compareSync(password, this.password);
};
UserSchema.methods.hasAny = function (...profiles) {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1);
};
const hasPassword = (obj, next) => {
    bcrypt.hash(obj.password, 10).then(hash => {
        obj.password = hash;
        next();
    }).catch(next);
};
const saveMiddleware = function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    else {
        hasPassword(user, next);
    }
};
const updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        next();
    }
    else {
        hasPassword(this.getUpdate(), next);
    }
};
UserSchema.pre('save', saveMiddleware);
UserSchema.pre('findOneAndUpdate', updateMiddleware);
UserSchema.pre('update', updateMiddleware);
exports.default = mongoose_1.model('User', UserSchema);
