////////////////////////////////view
db.createView(
  'user_complet',
  'utilisateurs',
  [
  {
    $lookup : {
      from : 'auth_utilisateur',
      localField : '_id',
      foreignField : 'id_user',
      as : 'auth_utilisateur'
    }
  }
  ]
)
db.createView(
  'user_complet_simple',
  'utilisateurs',
  [
  {
    $lookup : {
      from : 'auth_utilisateur',
      localField : '_id',
      foreignField : 'id_user',
	  pipeline : [
		{
		  $project : { email : 1}
		}
	  ],
      as : 'auth_utilisateur'
    }
  }
  ]
)
//plat_categorie
db.createView(
  'plat_complet',
  'plats',
  [
  {
    $lookup : {
      from : 'cat_plat',
      localField : 'id_cat_plat',
      foreignField : '_id',
      as : 'cat_plat'
    }
  },
  {
	$unwind : '$cat_plat'
  }
  ,
  {
    $lookup : {
      from : 'plat_resto',
      localField : '_id',
      foreignField : 'id_plat',
      as : 'plat_resto'
    }
  },
  {
	$unwind : '$plat_resto'
  }
  ]
)