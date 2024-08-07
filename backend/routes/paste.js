
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Function to generate a random URL
function generateRandomUrl() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let url = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        url += characters[randomIndex];
    }

    return url;
}


router.post('/paste', async (req, res) => {
    try {
        const { text, url, expireTime } = req.body;
        // console.log(text,url,expireTime)
        const generatedUrl = url || generateRandomUrl();

        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }

        // Save the data to the Supabase database
        const response = await supabase
            .from('data')
            .insert([{ text, url: generatedUrl,
                created_at: new Date().toISOString(),
                expire_in: expireTime }])
            .select();

        console.log('Supabase response:', response);

        const { data, error } = response;
        // console.log(data,error)

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.status(200).json({
            message: 'Data saved successfully',
            data: data
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'cannot save data to database' });
    }
});



router.get('/:url', async (req, res) => {
    try {
        const { url } = req.params;

        const response = await supabase
            .from('data')
            .select('text')
            .eq('url', url)
            .single();

        console.log('Supabase response:', response);

        const { data, error } = response;

        if (error) {
            if (error.code === 'PGRST116') { // Custom error code for not found
                return res.status(404).json({ message: 'Data not found' });
            }
            console.error('Supabase error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;