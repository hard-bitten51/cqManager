dbhelper  
===================================  
 	
##### This is is an database helper class,
##### To use it, you must install mysql lib first,
##### just run `npm install mysql -g --save` to install it. 
    

  
### example: 

		var db = require('database');
		var database = new db ();
		var con = {
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'test'
		};
		database.createConnect();
		database.open();
		database.query('set autocommit = 1');
		database.beginTransaction(function() {
			console.log('start transaction.');
		});
		database.query('insert into mytable(name,password) values(\'newMan1\',\'45678\')', function(err, res) {
			console.log(res);
		});
		database.rollback();
		database.commit();
	
		database.query('select * from mytable', function(err, res, fields) {
			console.log(res);
			database.close();
		});


### link  
1.[click here you can visit the page https://www.npmjs.com/package/dbhelper](https://www.npmjs.com/package/dbhelper)<br />  
