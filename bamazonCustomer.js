var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "summer2017",
  database: "bamazon"
});

connection.connect( function(err){

	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	afterConnection();

});

function afterConnection() {
	connection.query( "SELECT * FROM products" , function(err, res) {
		if (err) throw err;

		res.forEach( function(item){
			var rand = 
			console.log('\x1b[5m%s\x1b[0m', "id: " + item.item_id + "\n"
						+ "Product Name: " + item.product_name + "\n"
						+ "Price: " + item.price + "\n");
		});

		console.log("after");

		order();

		// connection.end();
	})
};

function order(){

	var quantity = 0;
	var itemId = 0;

	inquirer.
		prompt([
		{
			type: "input",
			message: "Please enter the id of the product you wish to buy:",
			name: "itemId"
		},

		{
			type: "input",
			message: "How many items do you want to buy?",
			name: "quantity"
		}


		]).then( function(response){
			quantity = response.quantity;
			itemId = response.itemId;

			connection.query("SELECT * FROM products WHERE item_id=?", itemId, function(err, res){
				if (err) throw err;
				if(quantity > res[0].stock_quantity){
					console.log("Insufficient quantity");
					order();
				}else{

					updateProducts(itemId, res[0].stock_quantity - quantity);

					console.log("The cost is: " +
						quantity*res[0].price + "\n");
					connection.end();

				}

				
			})
			


		});
}

function updateProducts(id, quantity){
	connection.query(
		"UPDATE products SET ? WHERE ?" ,
		[
			{
				stock_quantity: quantity
			},
			{
				item_id: id
			}
			],
			function(err, res){
				console.log(res.affectedRows + " products updated!\n");
			}
		);
}