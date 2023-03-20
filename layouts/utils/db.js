const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/mahasiswa";

// mongoose.connect(uri).then(() => console.log("Connected to DB")).catch(() => console.log("Failed Connected to DB"));
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Success to Connected")
    } catch {
        console.log("Failed to Connected")
    }
}
connectDB();




// const mhs1 = new mhs ({
//     nama: "Muhammad Fikri",
//     prodi: "Teknik Informatika"
// })

// mhs1.save().then((mhsw) => console.log(mhsw))