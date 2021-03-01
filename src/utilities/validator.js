let validator = {}

validator.validateDate = (fromTime,toTime) => {
    if(toTime.minutes > fromTime.minutes){
        if ((parseInt(toTime.minutes) - parseInt(fromTime.minutes)) == 30) {
            return true
        } 
    }
    else if(fromTime.minutes > toTime.minutes){
        if ((parseInt(fromTime.minutes) - parseInt(toTime.minutes)) == 30) {
            return true
        } 
    }
    
    else{
        let err = new Error("You can book slot only for 30mins")
        err.status = 406 //Not acceptable
        throw err
    }
}

module.exports = validator