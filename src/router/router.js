

const express = require("express");
const router = new express.Router();

const StudentModel= require('../model/students');
//const port = process.env.PORT || 6000;

router.get("/students", async (req, res) => {
    try {
        const data = await StudentModel.find({}).sort("fatherName");
        //.sort('firstName',1);
        res.send(data);
    } catch (err) {
        res.send(err);
    }
})
router.get('/student/:id', async (req, res) => {
    try {
       const id = req.params.id
        const data = await StudentModel.findById(id);
        console.log("data: ", data)
        if(data){
            console.log("if ke under")
            res.send(data)
        }
        else{
            res.send("data not found with this id..")
        }
       // res.send(result);
    }
    catch (err) {
        res.send(err);
    }
})

router.post("/students", async (req, res) => {
        try {
            const user = new StudentModel(req.body);

            const createUser = await user.save();
            res.send("Data updated....")
            

            res.send(createUser);
        } catch (err) {
            res.send(err);
        }
    })
    router.post("/students", async (req, res) => {
    try {
        const insertData = await StudentModel.insertMany(req.body.data)
        if (insertData) {
            res.send({ message: "data updated successfully", data: insertData })
        } else {
            res.send({ msg: "data not updated...." })
        }
    } catch (err) {
        res.send(err);
    }

})
router.delete("/students", async (req, res) => {
    try {
        // const data = await StudentModel.findOne({ _id: req.body._id })
        // if (data) {
        //     const deletedRecord = await StudentModel.deleteOne({_id: req.body._id})
        //     res.send({ message: "data deleted successfully", data: deletedRecord })

        // } else {
        //     res.send({ msg: "data not found with this id" })
        // }


        const deletedRecords = await StudentModel.findByIdAndDelete(req.body._id)
        if (!deletedRecords) {
            res.send({ message: "data not found ", data: deletedRecord })
        } else {
            res.send({ msg: "data deleted..." })
        }


    } catch (err) {
        console.log(err)
        res.send({ err: err })
    }
})


router.patch("/students", async (req, res) => {
    try {
        // const data = await StudentModel.findOne({ _id: req.body._id })
        // if (data) {
        //     const updatedRecord = await StudentModel.updateOne({ _id: req.body._id }, req.body);
        //     res.send({ message: "data updated successfully", data: updatedRecord })
        // } else {
        //     res.send({ msg: "data not found with this id" })
        // }
        const updateData = await StudentModel.findByIdAndUpdate(req.body._id, req.body)
        if (updateData) {
            res.send({ message: "updateData updated successfully", updateData })
        } else {
            res.send({ msg: "data not found with this id" })
        }

    } catch (err) {
        console.log(err)
        res.send({ err: err })
    }
})

module.exports = router