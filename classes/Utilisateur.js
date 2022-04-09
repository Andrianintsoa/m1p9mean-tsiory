var md5 = require('md5');
const Constantes = require('./Constantes');
const { ObjectId } = require('mongodb');
const DroitUser = require('./DroitUser')
let Utilisateur = class {
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
      "auth_utilisateur.mdp" : this.cryptMdp(this.mdp)
    })
    
    if (auth != null) {
      return auth
    }
    else {
      return null
    }
  }
  
  saltedMdp(mdp) {
    return "Tsiouuu" + mdp +"NotYourMdp"
  }
  cryptMdp(mdp) {
    return md5(this.saltedMdp(mdp))
  }

  saltedToken() {
    return "MyTokenIsHere" + this.email + this.mdp + Date.now() + "sira"
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
  findUser(db, data,typeUser) {
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
        image : this.image
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
module.exports = Utilisateur;

