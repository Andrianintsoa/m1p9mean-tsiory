const { ObjectId } = require('mongodb');
const Utilisateur = require('./Utilisateur')
const WsRenderer = require('./WsRenderer');
let Plat = class {
  constructor(_id, nom, image, id_user, id_cat_plat, montant, montant_revient) {
    //constructor() {
  }
  construct_data(data) {
    this.nom = data.nom;
    this.image = data.image;
    this.id_user = data.id_user;
    this.id_cat_plat = data.id_cat_plat;
    this.montant = data.montant;
    this.montant_revient = data.montant_revient;
  }
  getListePlats(db, data, tokenUser) {
    var platCollection = db.collection('plat_complet')
    data['plat_resto.id_resto'] = ObjectId(idResto)
    console.log(data)
    return platCollection.find(data).toArray()
  }
  getPlatResto(db, data, idResto) {
    var platCollection = db.collection('plat_complet')
    data['plat_resto.id_resto'] = ObjectId(idResto)
    console.log(data)
    return platCollection.find(data).toArray()
  }
  insertPlat(req, res, db) {
    var retour
    var platCollection = db.collection('plats')
    var platRestoCollection = db.collection('plat_resto')
    var platBody = {
      nom: this.nom,
      image: this.image,
      id_user: ObjectId(this.id_user),
      supprime: false,
      id_cat_plat: ObjectId(this.id_cat_plat),
      montant: this.montant,
      montant_revient: this.montant_revient
    }
    platCollection.insertOne(platBody).then(result => {
      this._id = result.insertedId
      var platRestoBody = {
        id_plat: ObjectId(this._id),
        id_resto : ObjectId(this.id_user)
      }
      console.log(platRestoBody)
      platRestoCollection.insertOne(platRestoBody)
        .then(resultat => {
        })
      if (result.acknowledged) {
        res.json(new WsRenderer("Insertion plat reussi", 200, result))
      }
      else {
        res.json(new WsRenderer("Insertion plat echoue", 400))
      }
    })
  }

}
module.exports = Plat;

