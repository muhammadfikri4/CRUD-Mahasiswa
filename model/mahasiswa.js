const mongoose = require('mongoose');

const mhs = mongoose.model("Teknik?", {
    nama: {
        type: String,
        required: true
    },
    nim: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fakultas: {
        type: String,
        required: true
    },
    prodi: {
        type: String,
        required: true
    }
});

module.exports = mhs;