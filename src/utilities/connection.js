const mongoose = require("mongoose")
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema
mongoose.set("useCreateIndex", true)
const url = 'mongodb://localhost:27017/ABCHospitalDB'

let patientSchema = {
    "appointmentDate": {
        type: Date,
        required: true
    },
    "patientDetails": {
        type: [{
            "patientName": {
                type: String,
                required: true
            },
            "age": {
                type: Number,
                required: true
            },
            "gender": {
                type: String,
                required: true
            },
            "contact": {
                type: Number,
                required: true

            },
            "slotId": {
                type: Number,
                required: true
            },
            "fromTime": {
                type: {
                    "hours": {
                        type: String,
                        required: true
                    },
                    "minutes": {
                        type: String,
                        required: true
                    }
                },
                required: true
            },
            "toTime": {
                type: {
                    "hours": {
                        type: String,
                        required: true
                    },
                    "minutes": {
                        type: String,
                        required: true
                    }
                },
                required: true
            }
        }],
        default: []
    }
}
let slotSchema = {
    "appointmentDate": {
        type: Date,
        required: true
    },
    
    "slotDetails": {
        type: [{
            "slotId": {
                type: Number,
                required: true
            },
            "fromTime": {
                type: {
                    "hours": {
                        type: String,
                        required: true
                    },
                    "minutes": {
                        type: String,
                        required: true
                    }
                },
                required: true
            },
            "toTime": {
                type: {
                    "hours": {
                        type: String,
                        required: true
                    },
                    "minutes": {
                        type: String,
                        required: true
                    }
                },
                required: true
            },
            "timing": {
                type: String,
                required: true
            },
            "booked": {
                type: Boolean,
                required: true,
                default : false
            }
        }],
        default: []
    }
}
    


let patientschema = new Schema(patientSchema, { collection: "Patient", timestamps: true })
let slotschema = new Schema(slotSchema, { collection: "Slot", timestamps: true })

let connection = {}
connection.Patients = async() => {
    try {
        return (await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })).model("Patient", patientschema)
    } catch (err) {
        let error = new Error("Could not connect to database")
        error.status = 500
        throw error
    }
}
connection.Slots = async() => {
    try {
        return (await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })).model("Slot", slotschema)
    } catch (err) {
        let error = new Error("Could not connect to database")
        error.status = 500
        throw error
    }
}

module.exports = connection