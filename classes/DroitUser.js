var md5 = require('md5');
const Constantes = require('./Constantes');
let DroitUser = class {
  constructor(commandePlat, affichageRevient, ajoutResto, ajoutPlat, modifPlat, panier) {
    this.commandePlat = commandePlat
    this.affichageRevient = affichageRevient
    this.ajoutResto = ajoutResto
    this.ajoutPlat = ajoutPlat
    this.modifPlat = modifPlat
    this.panier = panier
    //constructor() {
  }
  static getDroitUser(user) {
    console.log(user.id_type_u.toString())
    switch (user.id_type_u.toString()) {
      case Constantes.typeAdmin():
        return new DroitUser(false, true, true, false, false, false)
        break
      case Constantes.typeResto():
        return new DroitUser(false, true, false, true, true, false)
        break
      case Constantes.typeClient():
        return new DroitUser(true, false, false, false, false, true)
        break
      case Constantes.typeLivreur():
        return new DroitUser(false, false, false, false, false, false)
        break
      default:
        return new DroitUser()
        break
    }
  }
}
module.exports = DroitUser;

