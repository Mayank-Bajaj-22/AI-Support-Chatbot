import mongoose from "mongoose";

interface ISetting {
    ownerId: string
    businessName: string,
    supportEmail: string,
    knowledge: string
}

const settingSchema = new mongoose.Schema<ISetting>({
    ownerId: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    supportEmail: {
        type: String,
        required: true
    },
    knowledge: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema)

export default Setting