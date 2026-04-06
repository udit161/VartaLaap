import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: false,
        default: ""
    },
    img: {
        type: String,
        default: ""
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }
    ]
}, { timestamps: true });

const postModel = mongoose.model("Post", postSchema);

export default postModel;