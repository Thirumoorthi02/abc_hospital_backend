const PatientsData = require("./patients.json")
const SlotsData = require("./slots.json")
const connection = require("../utilities/connection");

let createConnection = async () => {
    patientCollection = await connection.Patients();
    slotCollection = await connection.Slots();
}

let model = {}
model.insertScript = async () => {

    await patientCollection.deleteMany();
    await slotCollection.deleteMany();
    let insertPdeatils = await patientCollection.insertMany(PatientsData);
    let insertSdeatils = await slotCollection.insertMany(SlotsData);
    if (insertPdeatils && insertPdeatils.length > 0 && insertSdeatils && insertSdeatils.length > 0) {
        return (insertPdeatils.length + insertSdeatils.length);
    } else {
        let err = new Error("Script insertion failed")
        err.status = 500
        throw new Error
    }

}


model.getAppointments = async (appointmentDate) => {

    let patientDetails = await patientCollection.findOne({
        appointmentDate: appointmentDate
    }, {
        _id: 0,
        patientDetails: 1
    });
    return patientDetails;

}

model.getSlotDetails = async (appointmentDate) => {

    let slotDetails = await slotCollection.findOne({
        appointmentDate: appointmentDate
    }, {
        _id: 0,
        slotDetails: 1
    });
    return slotDetails;

}

model.generateId = async () => {
    let slotId = await slotCollection.distinct("slotDetails.slotId")
    let newId = Math.max(...slotId)
    return newId > 0 ? Number(newId) + 1 : 1001
}

model.createSlot = async (appointmentDate, slotObj) => {

    let slotId = await model.generateId();
    slotObj.slotId = slotId;

    let result = await slotCollection.findOne({
        appointmentDate: appointmentDate
    }, {
        _id: 0,
        slotDetails: 1
    });

    if (result) {
        const isTimeOverlaps = result.slotDetails.find((slot) => {
            const getDateTime = time => new Date().setHours(Number(time.hours), Number(time.minutes), 0, 0);
            const receivedFromTime = getDateTime(slotObj.fromTime);
            const receivedToTime = getDateTime(slotObj.toTime);
            const givenFromTime = getDateTime(slot.fromTime);
            const givenToTime = getDateTime(slot.toTime);
            return (receivedFromTime >= givenFromTime && receivedFromTime < givenToTime) ||
                (receivedToTime >= givenFromTime && receivedToTime < givenToTime);
        });

        if (isTimeOverlaps) {
            return null;
        }
        let slots = await slotCollection.updateOne({
            appointmentDate: appointmentDate
        }, {
            $push: {
                slotDetails: slotObj
            }
        }, {
            runValidators: true
        });
        if (slots.nModified > 0) {
            return await slotCollection.findOne({
                appointmentDate: appointmentDate
            }, {
                _id: 0,
                slotDetails: 1
            });
        }
    } else {
        let newSlot = await slotCollection.create([{
            "appointmentDate": appointmentDate,
            "slotDetails": [slotObj]
        }]);
        if (newSlot) {
            return await slotCollection.findOne({
                appointmentDate: appointmentDate
            }, {
                _id: 0,
                slotDetails: 1
            });
        }
    }
}

model.bookaSlot = async (appointmentDate, slotId) => {

    const result = await slotCollection.findOne({
        appointmentDate: appointmentDate
    }, {
        _id: 0,
        slotDetails: 1
    });
    if (result) {
        let slot = result.slotDetails.find((sl) => sl.slotId == slotId)
        if (slot && slot.booked == false) {
            let booked = await slotCollection.updateOne({
                appointmentDate: appointmentDate,
                'slotDetails.slotId': slotId
            }, {
                $set: {
                    "slotDetails.$.booked": true
                }
            }, {
                runValidators: true
            });
            // console.log(await slotCollection.findOne({appointmentDate: appointmentDate},{_id:0, slotDetails :1}));
            if (booked.nModified > 0) {
                slot.booked = true;
                return result
            }

        } else {
            return null;
        }

    }


}
createConnection();
module.exports = model