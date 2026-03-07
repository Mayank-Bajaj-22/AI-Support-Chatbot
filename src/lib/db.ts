import { connect } from "mongoose"

const monogdbUrl = process.env.MONGODB_URL

if (!monogdbUrl) {
    console.log("mongo db connection string not found")
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = connect(monogdbUrl!).then((c) => c.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        throw error
    }

    return cached.conn
}

export default connectDB;