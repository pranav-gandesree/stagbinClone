const router = require('express').Router();
const Data = require('../models/data');

router.post('/paste', async(req,res)=>{
    try{
        const text = req.body.text;
        const newData = new Data({text:text});
        await newData.save();
        console.log('data saved to the database');

        res.status(200).json({
            message: 'data saved sucessfully'
        })
    }catch (error) {
        console.error('Error:', error);
        res.status(500).json({
          message: 'cannot save the data',
        });
      }
})