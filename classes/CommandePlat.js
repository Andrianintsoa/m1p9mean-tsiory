const Constantes = require('./Constantes');
const { ObjectId } = require('mongodb');
let CommandePlat = class {
  constructor(_id, id_plat, id_commande, quantite, montant, montant_revient) {
    this._id = _id;
    this.id_plat = id_plat;
    this.id_commande = id_commande;
    this.quantite = quantite;
    this.montant = montant;
    this.montant_revient = montant_revient;
  }
  static insererCommandePlat(db, data, id_commande) {
    return db.collection('plats').findOne({ _id: ObjectId(data.id_plat) }).then(function (plat) {
      var values = {
        id_plat: ObjectId(data.id_plat),
        id_commande: ObjectId(id_commande),
        quantite: data.quantite,
        montant: plat.montant,
        montant_revient: plat.montant_revient
      }
      return db.collection('commande_plat').insertOne(values)
    })
  }
  insererCommande(db, data) {
    console.log(data)
    if (data.id_commande == null) {
      console.log('COMMANDE NUll')
      var idC = ''
      return data.id_commande = this.creerNouveauCommande(db, data).then(function (response) {
        console.log('INSERTED' + response.insertedId)
        idC = response.insertedId
        return CommandePlat.insererCommandePlat(db, data, response.insertedId).then(function (commandePlat) {
          return {
            id_commande: response.insertedId,
            id_commande_plat: commandePlat.id_commande
          }
        })
      })
    }
    else {
      return CommandePlat.insererCommandePlat(db, data, data.id_commande).then(function (commandePlat) {
        return {
          id_commande: data.id_commande,
          id_commande_plat: commandePlat.insertedId
        }
      })
    }
    
  }
  creerNouveauCommande(db, data) {
    var values = {
      date_commande: new Date(),
      etat: 'cree',
      id_client: ObjectId(data.id_client),
      id_resto: ObjectId(data.id_resto)
    }
    return db.collection('commandes').insertOne(values).then(function (response) {
      var output = {
        insertedId: response.insertedId
      }
      return output
    })
  }
}
module.exports = CommandePlat;

