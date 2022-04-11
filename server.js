var md5 = require('md5');
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
const path = require('path')
// The products collection
var PRODUCTS_COLLECTION = "products";

// Create new instance of the express server
var app = express();
//myClasses
const Constantes = class {
  static typeClient() { return "624605e5302389a762d5fcff" }
  static typeAdmin() { return "62460574302389a762d5fcfb" }
  static typeResto() { return "624605bd302389a762d5fcfd" }
  static typeLivreur() { return "624605d4302389a762d5fcfe" }
}
const WsRenderer = class {
  constructor(message, status, data) {
    this.message = message
    this.status = status
    this.data = data
  }
  jsonReturn() {
    var jsonReturn = {
      meta: {
        message: this.message,
        status: this.status
      }
    }
    if (this.data != null) {
      jsonReturn.data =
        this.data
    }
    return jsonReturn
  }
}
const Utilisateur = class {
  constructor(_id, nom, adresse, supprime, id_type_u, email, mdp, image) {
    //constructor() {
  }
  static droitUser(user) {
    return DroitUser.getDroitUser(user)
  }
  construct_data(data) {
    this.nom = data.nom;
    this.adresse = data.adresse;
    this.mdp = data.mdp;
    this.email = data.email;
    this.id_type_u = data.id_type_u;
    this.image = data.image
  }
  //get token from requeest
  static getRequestToken(req) {
    var tokenUser = req.headers.authorization.split('Bearer ')[1]
    return tokenUser
  }
  //login test
  testLogin(db) {
    var authCollection = db.collection('user_complet')
    const auth = authCollection.findOne({
      id_type_u: ObjectId(this.id_type_u),
      "auth_utilisateur.email": this.email,
      "auth_utilisateur.mdp": this.cryptMdp(this.mdp)
    })

    if (auth != null) {
      return auth
    }
    else {
      return null
    }
  }

  saltedMdp(mdp) {
    return "MyPassword" + mdp + "RussiaMadagascar"
  }
  cryptMdp(mdp) {
    return md5(this.saltedMdp(mdp))
  }

  saltedToken() {
    return "MyPasswordMyEmail" + this.email + this.mdp + Date.now() + "salted"
  }
  createToken() {
    var defaultPassword = this.saltedToken()
    return md5(defaultPassword)
  }
  typeUser(type_user) {
    switch (type_user) {
      case "ekaly":
        return Constantes.typeEkaly()
        break
      case "resto":
        return Constantes.typeResto()
        break
      case "client":
        return Constantes.typeClient()
        break
      case "livreur":
        return Constantes.typeLivreur()
        break
      default:
        return Constantes.typeClient()
        break
    }
  }
  findUser(db, data, typeUser) {
    typeUser = this.typeUser(typeUser)
    data.id_type_u = ObjectId(typeUser)
    console.log(data)
    var resultats = db.collection('utilisateurs').find(data).toArray()
    return resultats
  }
  //inserer user
  insertUser(req, res, db, type_user) {
    var typeUser = this.typeUser(type_user)
    var userCollection = db.collection('utilisateurs');
    var authCollection = db.collection('auth_utilisateur');
    var userBody = {
      nom: this.nom,
      adresse: this.adresse,
      supprime: false,
      id_type_u: ObjectId(typeUser),
      image: this.image
    }
    var token = this.createToken()
    userCollection.insertOne(userBody).then(result => {
      this._id = result.insertedId
      var cryptedMdp = this.cryptMdp(this.mdp)
      var authBody = {
        mdp: cryptedMdp,
        email: this.email,
        token: token,
        date_token: Date.now(),
        id_user: ObjectId(this._id)
      }
      authCollection.insertOne(authBody).then(result => {
        console.log("Auth inserted");
      }).catch(error => console.error(error))
    }).catch(error => console.error(error))
    res.json({
      meta: {
        msg: 'User created',
        status: 200
      }
    });
  }
}
const WsRenderer = require('./classes/WsRenderer')
//CORS options
const cors = require('cors')
var corsOptions = {
  origin: "http://localhost:4200"
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
var distDir = __dirname + "/dist/node-express-angular";
app.use(express.static(distDir));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/dist/node-express-angular/index.html')));
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
        database = client.db('ekalymaster');
        console.log("Database connection done.");
        //debut copie
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
      app.get('/api/type_utilisateur', (req, res) => {
        database.collection('type_utilisateur').find().toArray()
          .then(utilisateurs => {
            console.log(database)
            res.json(utilisateurs)
          })
          .catch(/* ... */)
      })
      //users
      app.get('/api/utilisateurs', (req, res) => {
        database.collection('utilisateurs').find().toArray()
          .then(utilisateurs => {
            res.json(utilisateurs)
          })
          .catch(/* ... */)
      })
      //login
      app.post('/api/login', (req, res) => {
        var utilisateur = new Utilisateur()
        utilisateur.construct_data(req.body)
        var testLogin = utilisateur.testLogin(database)
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
      app.get('/api/clients', (req, res) => {
        var utilisateur = new Utilisateur()
        utilisateur.construct_data(req.body)
        resultat = utilisateur.findUser(database, req.body, "client").then(function (users) {
          var jsonReturn = new WsRenderer("Liste des clients ekaly", 200, users)
          res.json(jsonReturn.jsonReturn())
        })
          .catch(function (error) {
            var jsonReturn = new WsRenderer("Erreur requete liste des clients ekaly", 500)
            res.json(jsonReturn.jsonReturn())
          })
      })
      app.post('/api/clients', (req, res) => {
        var utilisateur = new Utilisateur()
        utilisateur.construct_data(req.body)
        utilisateur.insertUser(req, res, database, "client");
      })
      //livreurs
      app.get('/api/livreurs', (req, res) => {
        var utilisateur = new Utilisateur()
        utilisateur.construct_data(req.body)
        resultat = utilisateur.findUser(database, req.body, "livreur").then(function (users) {
          var jsonReturn = new WsRenderer("Liste des livreurs ekaly", 200, users)
          res.json(jsonReturn.jsonReturn())
        })
          .catch(function (error) {
            var jsonReturn = new WsRenderer("Erreur requete liste des livreurs ekaly", 500)
            res.json(jsonReturn.jsonReturn())
          })
      })
      app.post('/api/livreurs', (req, res) => {
        var utilisateur = new Utilisateur()
        utilisateur.construct_data(req.body)
        utilisateur.insertUser(req, res, database, "livreur")
      })
      //restos
      app.get('/api/restos', (req, res) => {
        var utilisateur = new Utilisateur()
        utilisateur.construct_data(req.body)
        resultat = utilisateur.findUser(database, req.body, "resto").then(function (users) {
          var jsonReturn = new WsRenderer("Liste des livreurs ekaly", 200, users)
          res.json(jsonReturn.jsonReturn())
        })
          .catch(function (error) {
            var jsonReturn = new WsRenderer("Erreur requete liste des restaurants ekaly", 500)
            res.json(jsonReturn.jsonReturn())
          })
      })
      app.post('/api/restos', (req, res) => {
        var utilisateur = new Utilisateur()
        utilisateur.construct_data(req.body)
        utilisateur.insertUser(req, res, database, "resto");
      })
      //admin
      app.post('/api/admin', (req, res) => {
        var utilisateur = new Utilisateur()
        utilisateur.construct_data(req.body)
        utilisateur.insertUser(req, res, database, "admin");
      })
      //utilisateurs
      app.get('/api/droit-utilisateur', (req, res) => {
        var token = Utilisateur.getRequestToken(req)
        database.collection('user_complet').find({ "auth_utilisateur.token": token }).project({ "auth_utilisateur.token": 0, "auth_utilisateur.mdp": 0 }).toArray()
          .then(users => {
            console
            var droits = Utilisateur.droitUser(users[0])
            var jsonReturn = new WsRenderer("droits utilisateurs", 200, droits)
            res.json(jsonReturn.jsonReturn())
          })
          .catch(error => {
            var jsonReturn = new WsRenderer(error.message, 400)
            res.json(jsonReturn.jsonReturn())
          })
      })
      app.get('/api/utilisateurs-complet', (req, res) => {
        var token = req.headers.authorization.split('Bearer ')[1]
        database.collection('user_complet').find({ "auth_utilisateur.token": token }).project({ "auth_utilisateur.token": 0, "auth_utilisateur.mdp": 0 }).toArray()
          .then(quotes => {
            var jsonReturn = new WsRenderer("Liste des utilisateurs complets", 200, quotes)
            res.json(jsonReturn.jsonReturn())
          })
          .catch(error => {
            jsonReturn = new WsRenderer(error.message, 400)
            res.json(jsonReturn.jsonReturn())
          })
      })

      app.get('/api/utilisateurs', (req, res) => {
        database.collection('utilisateurs').find(req.query).toArray()
          .then(quotes => {
            var jsonReturn = new WsRenderer("Liste des categories de plats", 200, quotes)
            res.json(jsonReturn.jsonReturn())
          })
          .catch(error => {
            var jsonReturn = new WsRenderer(error.message, 400)
            res.json(jsonReturn.jsonReturn())
          })
      })

      //categorie plat
      app.get('/api/categorie_plat', (req, res) => {
        database.collection('cat_plat').find(req.query).toArray()
          .then(quotes => {
            var jsonReturn = new WsRenderer("Liste des categories de plats", 200, quotes)
            res.json(jsonReturn.jsonReturn())
          })
          .catch(error => {
            var jsonReturn = new WsRenderer(error.message, 400)
            res.json(jsonReturn.jsonReturn())
          })
      })
      app.post('/api/categorie_plat', (req, res) => {
        var cat_plat = database.collection('cat_plat')
        cat_plat.insertOne(req.body)
          .then(result => {
            var jsonReturn = new WsRenderer("Nouveau categorie plat", 200, { insertedId: result.insertedId })
            res.json(jsonReturn.jsonReturn())
          })
          .catch(error => {
            var jsonReturn = new WsRenderer("Nouveau plat echoue", 400)
            res.json(jsonReturn.jsonReturn())
          })
      })
        //fin copie
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

// Errors handler.
function manageError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({ "error": message });
}
