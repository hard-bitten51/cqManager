function Database() {
	//load mysql lib
	this.mysql = require('mysql');

	//configure the database connection info
	this.defaults = {
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'test'
	};

	this.createConnect = function createConnect(configure) {
		if (configure) {
			this.connection = this.mysql.createConnection(configure);
		} else {
			this.connection = this.mysql.createConnection(this.defaults);
		}
	};

	this.open = function open() {
		return this.connection.connect(function(err) {
			if (err) {
				console.log(err);
			}
		});
	};

	this.close = function() {
		return this.connection.end(function(err) {
			if (err) {
				console.log(err);
			}
		});
	};

	this.query = function query(sql, callback) {
		if (!callback && typeof sql === 'function') {
			callback = sql;
			sql = {};
		}

		sql = sql || {};
		return this.connection.query(sql, callback);
	};

	this.beginTransaction = function beginTransaction(options, callback) {
		if (!callback && typeof options === 'function') {
			callback = options;
			options = {};
		}

		options = options || {};
		options.sql = 'START TRANSACTION';
		options.values = null;

		return this.connection.query(options, callback);
	};

	this.commit = function commit(options, callback) {
		if (!callback && typeof options === 'function') {
			callback = options;
			options = {};
		}

		options = options || {};
		options.sql = 'COMMIT';
		options.values = null;

		return this.query(options, callback);
	};

	this.rollback = function rollback(options, callback) {
		if (!callback && typeof options === 'function') {
			callback = options;
			options = {};
		}

		options = options || {};
		options.sql = 'ROLLBACK';
		options.values = null;

		return this.query(options, callback);
	};
}

module.exports = Database;