const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');

let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'classicmodels',
    port: 3306
});
db.connect( function(err){
    if(err){
        throw err;
    }
    console.log('connected to mysql server');
});

app.set('view engine','ejs');
app.use(express.static('public'))

app.get('/',function(req,res){
    res.render('index.ejs');
});

io.sockets.on('connection',function(socket){
    console.log('connection made by: ' + socket.id);
    socket.on('disconnect',function(){
        console.log(socket.id + " has disconnected");
    });

    socket.on('get_table', function(tablename){
        let q = 'select * from ' + tablename;
        db.query(q, function(err,results,fields){
            if(err){
                throw err;
            }
            console.log(results);
            io.emit('send_table',JSON.stringify(results));
        });
    });

    socket.on('get_record',function(info){
        info = JSON.parse(info);
        console.log(info);
        let q = 'select * from ' + info.table + " where " + info.pk +
                        "=" + info.value + " limit 1";
        db.query(q, function(err,results,fields){
            if(err){
                throw err;
            }
            console.log(results);
            io.emit('send_record',JSON.stringify(results));
        });
    });

    //composite primary key
    socket.on('get_record',function(info){
        info = JSON.parse(info);
        console.log(info);
        let q = "";
        if (Array.isArray(info.pk)){
            q = 'select * from ' + info.table + " where " + info.pk[0] +
                "=" + info.value[0] + " and " + info.pk[1] + "='" + info.value[1] + "' limit 1";
            console.log(q);
        }
        else{
            q = 'select * from ' + info.table + " where " + info.pk +
                "=" + info.value + " limit 1";
            console.log(q);
        }
        db.query(q, function(err,results,fields){
            if(err){
                throw err;
            }
            console.log(results);
            io.emit('send_record',JSON.stringify(results));
        });
    });
   
});

let port = 7777;
const server = http.listen(port,function(){
    console.log('listing on port: ',port);
});