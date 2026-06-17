import mongoose from "mongoose";

// Schema for the News Article
const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            default: "General",
        },
    },
    { timestamps : true}
);

// Model for News
const News = mongoose.model("News", newsSchema);
export default News;