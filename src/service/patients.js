const dbLayer = require("../model/patient")
const validator = require("../utilities/validator")

let service = {}

service.insertScript = async() => {
    let data = await dbLayer.insertScript();
    return data;
}



service.getAppointments = async(selectedDate) => {
    let data = await dbLayer.getAppointments(selectedDate)
    if (data) {
        return data
    } else {
        let err = new Error("No patient details found")
        err.status = 404
        throw err
    }
}

service.getSlotDetails = async(selectedDate) => {
    let data = await dbLayer.getSlotDetails(selectedDate)
    if (data) {
        return data
    } else {
        let err = new Error("No Slot details found")
        err.status = 404
        throw err
    }
}



service.createSlot = async(appointmentDate, slotObj) => {
    validator.validateDate(slotObj.fromTime,slotObj.toTime);
    let slotId = await dbLayer.createSlot(appointmentDate, slotObj);
    if (slotId) {
        return slotId
    } else {
        let err = new Error("New Slot cannot be added")
        err.status = 400
        throw err
    }
}

service.bookaSlot = async(appointmentDate, slotId) => {
    let slot = await dbLayer.bookaSlot(appointmentDate, slotId);
    if (slot) {
        return slot
    } else {
        let err = new Error("This Slot is already booked, Please book another slot")
        err.status = 400
        throw err
    }
}


module.exports = service