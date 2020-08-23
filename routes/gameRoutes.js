const express = require('express');
const router = express.Router();
const axios=require('axios');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());



router.get('/', function (req, res) {
    let namelist=[];
    
    axios.get('https://api.rawg.io/api/games?dates=2020-07-01,2020-08-20&page_size=6')
    .then((response) => {
      //console.log(response.data);
      namelist=response.data.results;
      //console.log(namelist.results[0].background_image);
      res.render('index',{namelist:namelist});
      
    }, (error) => {
      console.log(error);
    });


});

router.get('/games/:id', function (req, res) {
    let gameid=req.params.id;
    let gamedata,suggested,screenshots;

    const req1=axios.get(`https://api.rawg.io/api/games/${gameid}`);
    const req2=axios.get(`https://api.rawg.io/api/games/${gameid}/suggested`);
    const req3=axios.get(`https://api.rawg.io/api/games/${gameid}/screenshots`);
    
    axios.all([req1,req2,req3])
    .then(
        axios.spread((...responses) => {
 
      gamedata=responses[0].data;
      suggested=responses[1].data.results; 
      screenshots=responses[2].data.results;


      res.render('gamepage',{gamedata,suggested,screenshots});

    })
    )
    .catch(error => {
      console.log(error);
    });
});



















module.exports = router;