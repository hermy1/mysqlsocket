window.addEventListener('load', function(e){
    let port = 7777;
    let socket = io.connect('http://localhost:' + port);

    socket.emit('get_table','employees');

    socket.on('send_table',function(results){
        results = JSON.parse(results);
        console.log(results);
    });

    socket.emit('get_record',JSON.stringify(
        {table:'offices',
            pk:'officeCode',
            value: 1}));

    socket.on('send_record',function(result){
        result = JSON.parse(result);
        console.log(result);
    });
   

    // socket.emit('get_record',JSON.stringify(
    //     {table:'orderdetails',
    //         pk:['orderNumber','productCode'],
    //         value: [10100,'S18_1749']}));

    // socket.emit('get_record',JSON.stringify(
    //     {table:'customers',
    //         pk:'customerNumber',
    //         value: 103}));


});
