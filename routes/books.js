var router = require('express').Router();
var pg = require('pg'); //need to install if starting from scratch npm install pg --save check json file dependencies

var config ={       //to access database
    database:'rho'
};

//initialize the database connection pool defaults at 10 connection
var pool = new pg.Pool(config);

router.post('/', function(req, res){

    pool.connect(function(err, client, done){
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return;
        }
//creating new row into the table , $1 - placeholder for the paramaters // returning all
        client.query('INSERT INTO books (author, title, published) VALUES ($1, $2,$3) returning *;', [req.body.author, req.body.title, req.body.published],  function(err, result){
            done();
            if(err){
                console.log('Error connecting to the DB', err);
                res.sendStatus(500);

                return;
            }

            console.log('Got rows from the DB:',result.rows);
            res.send(result.rows);

        });

    });
});

router.get('/:id', function(req,res){

    pool.connect(function(err, client, done){
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return;
        }

        client.query('SELECT * FROM books WHERE id=$1;', [req.params.id],  function(err, result){
            done();
            if(err){
                console.log('Error connecting to the DB', err);
                res.sendStatus(500);

                return;
            }

            console.log('Got rows from the DB:',result.rows);
            res.send(result.rows);

        });

    });


});

router.get('/', function(req, res){
    //err -an error object, will not be null if there was an error connecting
    //possible errors, db not running, config is wrong
    //client object to make queries against the database
    pool.connect(function(err, client, done){
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return; //stops execution of the function
        }


//takes input as 1. SQL string 2(optional)-input parameters 3. callback function to execute once query is finished takes an error object
// and a result object as arguments
        client.query('SELECT * FROM books', function(err, result){
            done();
            if(err){
                console.log('Error connecting to the DB', err);
                res.sendStatus(500);

                return;
            }

            console.log('Got rows from the DB:',result.rows);
            res.send(result.rows);

        });                                        //done - function to call when connection is done.returns connection back to the pool

    });
});

module.exports=router;
