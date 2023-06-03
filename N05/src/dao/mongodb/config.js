/* MONGOOSE ---------------------------------------- */
import mongoose from 'mongoose';

export async function connection () {
    try {
        await mongoose.connect("mongodb+srv://mariagroppo86:SwXTw96jwHQ2bZVT@codercluster.qg5m3ro.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log("Conectado a Mongo");
    } catch (error) {
        console.log(error);
    }
}