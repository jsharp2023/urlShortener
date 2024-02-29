require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const shortId = require('shortid');
const validUrl = require('valid-url');
const app = express();




// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String,
});

const UrlModel = mongoose.model('Url', urlSchema);

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shouturl', async(req, res) => {
  const { url } = req.body.url;
  const urlCode = shortId.generate();

  if (!validUrl.isUri(url)){
    return res.status(401).json({ error: 'invalid URL'})
  }

  try {
    let findOne = await UrlModel.findOne({ original_url: url});
    if (findOne) {
      res.json({ original_url: findOne.original_url, short_url: findOne, short_url});
    } else {
      findOne = new UrlModel({ original_url: url, short_url: urlCode});
      await findOne.save();
      res.json({ original_url: url, short_url: urlCode});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

app.get("api/shouturl/:shout_url", async (req, res) => {
  try {
    const urlParams = await UrlModel.findOne({ short_url: req.params,
    short_url});
    if ( urlParams ) {
      return res.redirect(urlParmas.original_url);
    }else {
      return res.status(404).json('No URL Found');
    }
  }catch (err) {
    console.erroe(err);
    res.status(500).json('Server error')
  }
});

//Your First API endPoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API'});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
