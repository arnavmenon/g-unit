const express = require('express');
const router = express.Router();
const axios=require('axios');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());



router.get('/', function (req, res) {
    let namelist=[];
    
    axios.get('https://api.rawg.io/api/games?dates=2020-06-01,2020-08-20&page_size=6')
    .then((response) => {
      //console.log(response.data);
      namelist=response.data.results;
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

router.get('/search',function(req,res) {

    res.render('search');

})

router.get('/search/matches/:searchText',function(req,res) {

    let searchText=req.params.searchText;

    //console.log("st",searchText);

    axios.get(`https://api.rawg.io/api/games?page_size=18&search=${searchText}`)
    .then((response) => {
      
        let namelist=response.data.results;
        res.send(namelist);
      
    }, (error) => {
      console.log(error);
    });


})



















module.exports = router;