// Use Express
var express = require("express");
require('./dotenv')
// Use body-parser
var bodyParser = require("body-parser");
// Use MongoDB
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
// The database variable
var database;
// The products collection
var PRODUCTS_COLLECTION = "products";

// Create new instance of the express server
var app = express();

//CORS options
const cors = require('cors')
var corsOptions = {
  origin: "http://localhost:8080"
  //origin : "https://m1p9mean-tsiory.herokuapp.com:8080"
}
app.use(cors(corsOptions))

// Define the JSON parser as a default way 
// to consume and produce data through the 
// exposed APIs
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Local port.
const LOCAL_PORT = 8080;

// Init the server
//mongodb.MongoClient.connect(process.env.MONGODB_URL || LOCAL_DATABASE,
const connectionString = process.env.DB_URL
mongodb.MongoClient.connect(connectionString
  ,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }, function (error, client) {

        // Check if there are any problems with the connection to MongoDB database.
        if (error) {
            console.log(error);
            process.exit(1);
        }

        // Save database object from the callback for reuse.
        database = client.db();
        console.log("Database connection done.");

        // Initialize the app.
        var server = app.listen(process.env.PORT || LOCAL_PORT, function () {
            var port = server.address().port;
            console.log("App now running on port", port);
        });
    });

/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});

/*  "/api/products"
 *  GET: finds all products
 */
app.get("/api/products", function (req, res) {
    database.collection(PRODUCTS_COLLECTION).find({}).toArray(function (error, data) {
        if (error) {
            manageError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(data);
        }
    });
});

/*  "/api/products"
 *   POST: creates a new product
 */
app.post("/api/products", function (req, res) {
    var product = req.body;

    if (!product.name) {
        manageError(res, "Invalid product input", "Name is mandatory.", 400);
    } else if (!product.brand) {
        manageError(res, "Invalid product input", "Brand is mandatory.", 400);
    } else {
        database.collection(PRODUCTS_COLLECTION).insertOne(product, function (err, doc) {
            if (err) {
                manageError(res, err.message, "Failed to create new product.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

/*  "/api/products/:id"
 *   DELETE: deletes product by id
 */
app.delete("/api/products/:id", function (req, res) {
    if (req.params.id.length > 24 || req.params.id.length < 24) {
        manageError(res, "Invalid product id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
    } else {
        database.collection(PRODUCTS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
            if (err) {
                manageError(res, err.message, "Failed to delete product.");
            } else {
                res.status(200).json(req.params.id);
            }
        });
    }
});

//type_utilisateurs
app.get('/type_utilisateur', (req, res) => {
  database.collection('type_utilisateur').find().toArray()
    .then(utilisateurs => {
      res.json(utilisateurs)
    })
    .catch(/* ... */)
})
//users
app.get('/utilisateurs', (req, res) => {
  database.collection('utilisateurs').find().toArray()
    .then(utilisateurs => {
      res.json(utilisateurs)
    })
    .catch(/* ... */)
})
//login
app.post('/login', (req, res) => {
  var utilisateur = new Utilisateur()
  utilisateur.construct_data(req.body)
  var testLogin = utilisateur.testLogin(db)
  testLogin.then(function (auth) {
    var wsRenderer
    if (auth != null) {
      wsRenderer = new WsRenderer("Login success", 200, {
        token: auth.auth_utilisateur[0].token,
        id_type_u: auth.id_type_u,
        _id: auth._id
      })
    }
    else {
      wsRenderer = new WsRenderer("Login failed", 400)
    }
    res.json(wsRenderer.jsonReturn())
  })
})
//clients
app.get('/clients', (req, res) => {
  var utilisateur = new Utilisateur()
  utilisateur.construct_data(req.body)
  resultat = utilisateur.findUser(db, req.body, "client").then(function (users) {
    var jsonReturn = new WsRenderer("Liste des clients ekaly", 200, users)
    res.json(jsonReturn.jsonReturn())
  })
    .catch(function (error) {
      var jsonReturn = new WsRenderer("Erreur requete liste des clients ekaly", 500)
      res.json(jsonReturn.jsonReturn())
    })
})
app.post('/clients', (req, res) => {
  var utilisateur = new Utilisateur()
  utilisateur.construct_data(req.body)
  utilisateur.insertUser(req, res, db, "client");
})
//livreurs
app.get('/livreurs', (req, res) => {
  var utilisateur = new Utilisateur()
  utilisateur.construct_data(req.body)
  resultat = utilisateur.findUser(db, req.body, "livreur").then(function (users) {
    var jsonReturn = new WsRenderer("Liste des livreurs ekaly", 200, users)
    res.json(jsonReturn.jsonReturn())
  })
    .catch(function (error) {
      var jsonReturn = new WsRenderer("Erreur requete liste des livreurs ekaly", 500)
      res.json(jsonReturn.jsonReturn())
    })
})
app.post('/livreurs', (req, res) => {
  var utilisateur = new Utilisateur()
  utilisateur.construct_data(req.body)
  utilisateur.insertUser(req, res, db, "livreur")
})
//restos
app.get('/restos', (req, res) => {
  var utilisateur = new Utilisateur()
  utilisateur.construct_data(req.body)
  resultat = utilisateur.findUser(db, req.body, "resto").then(function (users) {
    var jsonReturn = new WsRenderer("Liste des livreurs ekaly", 200, users)
    res.json(jsonReturn.jsonReturn())
  })
    .catch(function (error) {
      var jsonReturn = new WsRenderer("Erreur requete liste des restaurants ekaly", 500)
      res.json(jsonReturn.jsonReturn())
    })
})
app.post('/restos', (req, res) => {
  var utilisateur = new Utilisateur()
  utilisateur.construct_data(req.body)
  utilisateur.insertUser(req, res, db, "resto");
})
//admin
app.post('/admin', (req, res) => {
  var utilisateur = new Utilisateur()
  utilisateur.construct_data(req.body)
  utilisateur.insertUser(req, res, db, "admin");
})
//utilisateurs
app.get('/droit-utilisateur', (req, res) => {
  var token = Utilisateur.getRequestToken(req)
  db.collection('user_complet').find({ "auth_utilisateur.token": token }).project({ "auth_utilisateur.token": 0, "auth_utilisateur.mdp": 0 }).toArray()
    .then(users => {
      console
      var droits = Utilisateur.droitUser(users[0])
      jsonReturn = new WsRenderer("droits utilisateurs", 200, droits)
      res.json(jsonReturn.jsonReturn())
    })
    .catch(error => {
      jsonReturn = new WsRenderer(error.message, 400)
      res.json(jsonReturn.jsonReturn())
    })
})
app.get('/utilisateurs-complet', (req, res) => {
  var token = req.headers.authorization.split('Bearer ')[1]
  db.collection('user_complet').find({ "auth_utilisateur.token": token }).project({ "auth_utilisateur.token": 0, "auth_utilisateur.mdp": 0 }).toArray()
    .then(quotes => {
      jsonReturn = new WsRenderer("Liste des utilisateurs complets", 200, quotes)
      res.json(jsonReturn.jsonReturn())
    })
    .catch(error => {
      jsonReturn = new WsRenderer(error.message, 400)
      res.json(jsonReturn.jsonReturn())
    })
})

app.get('/utilisateurs', (req, res) => {
  db.collection('utilisateurs').find(req.query).toArray()
    .then(quotes => {
      jsonReturn = new WsRenderer("Liste des categories de plats", 200, quotes)
      res.json(jsonReturn.jsonReturn())
    })
    .catch(error => {
      jsonReturn = new WsRenderer(error.message, 400)
      res.json(jsonReturn.jsonReturn())
    })
})
// Errors handler.
function manageError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({ "error": message });
}
