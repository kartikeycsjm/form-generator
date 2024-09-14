import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    fields: [
        {
            id: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            label: {
                type: String,
                required: true
            }
        }
    ]
});

const user =mongoose.models.users||mongoose.model('users', schema);

export default user;