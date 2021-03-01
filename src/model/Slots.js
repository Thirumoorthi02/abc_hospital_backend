class Slot {
    constructor(obj) {
        this.slotId = obj.slotId,
        this.fromTime = obj.fromTime,
        this.toTime = obj.toTime,
        this.timing = obj.timing,
        this.booked = obj.booked
    }
}

module.exports = Slot;