const express = require('express');
const routing = express.Router();
const service = require("../service/patients");
const Slot = require('../model/Slots')



routing.get("/setupDB", async (req, res, next) => {
    try {
        let data = await service.insertScript();
        if (data) {
            res.status(201)
            res.json({
                message: "Inserted " + data + " document in database"
            })
        }
    } catch (err) {
        next(err)
    }
})

//---------------------------------------------------------------------------------------


//Routing to get appointments details 
routing.get('/getappointments/:appointmentDate', async (req, res, next) => {
    let appointmentDate = req.params.appointmentDate;
    try {
        let appointmentDetails = await service.getAppointments(appointmentDate)
        res.status(200)
        res.json(appointmentDetails)
    } catch (err) {
        next(err)
    }
})

//Routing to get slot details 
routing.get('/getslotdetails/:appointmentDate', async (req, res, next) => {
    let appointmentDate = req.params.appointmentDate;
    try {
        let slotDetails = await service.getSlotDetails(appointmentDate)
        res.status(200)
        res.json(slotDetails)
    } catch (err) {
        next(err)
    }
})


//---------------------------------------------------------------------------------------

//Routing to addaslot for for doctor 
routing.put("/addaslot/:appointmentDate", async (req, res, next) => {

    let slotObj = new Slot(req.body);
    let appointmentDate = req.params.appointmentDate;
    try {
        let slot = await service.createSlot(appointmentDate, slotObj);
        if (slot) {
            // res.json({ message: "Slot Created Successfully with id : " + slotId })
            res.json(slot);
        }

    } catch (err) {
        next(err)
    }
})

//Routing to bookaslot for for patient 
routing.post("/bookaslot/:appointmentDate", async (req, res, next) => {

    let slotId = req.body.slotId
    let appointmentDate = req.params.appointmentDate;
    try {
        let slot = await service.bookaSlot(appointmentDate, slotId);
        if (slot) {
            // res.json({ message: "Slot Booked"})
            res.json(slot)
        }

    } catch (err) {
        next(err)
    }
})
//---------------------------------------------------------------------------------------


module.exports = routing;