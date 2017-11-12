const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "summer2017",
  database: "bamazon"
});

connection.connect( function(err){

	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	afterConnection();
});

function afterConnection(){

	console.log("This executed \n" + "PLEASE");

	inquirer.
		prompt([
		{
			type: "list",
			message: "What's your command?",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory" , "Add New Product" , "Exit"],
			name: "Options"
		}]).then( function(response){
			var options = response.Options;

			if(options === "View Products for Sale"){
				connection.query( "SELECT * FROM products" , function(err, res) {
					if (err) throw err;

					res.forEach( function(item){
						console.log('\x1b[5m%s\x1b[0m', "id: " + item.item_id + "\n"
									+ "Product Name: " + item.product_name + "\n"
									+ "Price: " + item.price + "\n");
					});

					afterConnection();
				})

				

			}else if(options === "View Low Inventory"){
				connection.query( "SELECT * FROM products" , function(err, res) {
					if (err) throw err;

					res.forEach( function(item){

						if(item.stock_quantity < 5){
							console.log('\x1b[5m%s\x1b[0m', "id: " + item.item_id + "\n"
										+ "Product Name: " + item.product_name + "\n"
										+ "Price: " + item.price + "\n");
						}
					});

					afterConnection();
				})

			}else if(options === "Add to Inventory"){
				addInventory();
			}
			else if(options === "Add New Product"){
				addProduct();
			}else if(options === "Exit"){
				connection.end();
			}

			
		});
}

function addInventory(){

	inquirer.
		prompt([
		{
			type: "input",
			message: "Please enter the id of the item:",
			name: "itemId"
		},
		{
			type: "input",
			message: "Enter the number of items you want to add:",
			name: "quantity"
		}]).then( function(response){

			var currentQuantity;
			var itemId = response.itemId;
			var quantity = parseInt(response.quantity);

			connection.query("SELECT * FROM products WHERE item_id=?", itemId, function(err, res) {
			    if (err) throw err;

			    currentQuantity = parseInt(res[0].stock_quantity);

			    connection.query(
					"UPDATE products SET ? WHERE ?", 
					[{
					        stock_quantity: currentQuantity+quantity
					    },
					    {
					        item_id: itemId
					    }
					],
					function(err, res) {
					    console.log(res.affectedRows + " products updated!\n");
					    afterConnection();
					}
				);
				
			});

		});
				
}

function addProduct(){
	inquirer.
	 prompt([
	 {
	 	type: "input",
	 	message: "Please enter the product name",
	 	name: "prName"
	 },
	 {
	 	type: "input",
	 	message: "Please enter the product department",
	 	name: "prDepartment"
	 },
	 {
	 	type: "input",
	 	message: "Please enter the product price",
	 	name: "prPrice"
	 },
	 {
	 	type: "input",
	 	message: "How many of this item do you want to add?",
	 	name: "prQuantity"
	 }]).then( function(response){
	 	var productName = response.prName;
	 	var department = response.prDepartment;
	 	var price = response.prPrice;
	 	var quantity = response.prQuantity;
	 	connection.query("INSERT INTO products SET ?",
		 	{
		 		product_name: productName,
		 		department_name: department,
		 		price: price,
		 		stock_quantity: quantity 
		 	},
		 	function(err, res){
		 		console.log(res.affectedRows + " product(s) added!\n");
		 		afterConnection();
			}
		);
	 })
}