var models = require('./models');



module.exports.getUserByEmail = (email) => {
  return models.users.findOne({
    where: {email}
  })
  .then((user) => {
    if (user) {
      return user;
    } else {
      return new Promise((resolve, reject) => {
        reject('There is no user registered under the email ' + email);
      });
    }
  });
};



module.exports.getTrailsByName = (name) => {
  if (!name || name.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected a string but instead was passed in ' + name);
    });
  }

  return models.trails.findAll({
    where: {name}
  })
  .then((trails) => {
    for (let i = 0; i < trails.length; i++) {
      trails[i].latitude = parseFloat(trails[i].latitude);
      trails[i].longitude = parseFloat(trails[i].longitude);
    }
    return trails;
  });
};

module.exports.getAllTrails = () => {
  return models.trails.findAll()
  .then((trails) => {
    for (let i = 0; i < trails.length; i++) {
      trails[i].latitude = parseFloat(trails[i].latitude);
      trails[i].longitude = parseFloat(trails[i].longitude);
    }
    return trails;
  });
};

module.exports.createTrail = (name, directions='', latitude=0, longitude=0) => {
  if (!name || name.constructor !== String || name === '') {
    return new Promise((resolve, reject) => {
      reject('Expected trail name to be a non-empty string, but instead got ' + name);
    });
  }
  if (!directions || directions.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected trail description to be a string, but instead got ' + description);
    });
  }

  return models.trails.create({
    name, directions, latitude, longitude
  });
};



<<<<<<< HEAD
// posterData can be either a user ID or a user email (REMEMBER: user IDs are STRINGS, NOT numbers)
// trailData can be either a trail ID or a trail name
// posterDataType should either be 'id' or 'email'
module.exports.createPost = (posterEmail, trailId, title, text, imageUrl, latitude=0, longitude=0) => {
  if (!posterEmail || posterEmail.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected poster email to be a string, but instead it was ' + posterEmail);
    });
  }
  if (!title || title.constructor !== String || title === '') {
    return new Promise((resolve, reject) => {
      reject('Expected title to be a string, but instead it was ' + title);
    });
  }
  if (!text || text.constructor !== String || text === '') {
    return new Promise((resolve, reject) => {
      reject('Expected text to be a string, but instead it was ' + text);
    });
  }
  if (!imageUrl || imageUrl.constructor !== String || imageUrl === '') {
    return new Promise((resolve, reject) => {
      reject('Expected image url to be a string, but instead it was ' + imageUrl);
    });
  }

  return module.exports.getUserByEmail(posterEmail)
  .then((poster) => {
    return models.posts.create({
      title,
      text,
      image_url: imageUrl,
      view_count: 0,
      flag_count: 0,
      latitude,
      longitude,
      poster_user_id: poster.id,
      trail_id: trailId
    });
  });
};
=======
// module.exports.getPostById = (id) => {
//   return helpers.getPost({id});
// };

// module.exports.getPostsByUserId = (id) => {
//   return helpers.getPosts({poster_user_id: id});
// };
>>>>>>> Has unuseful functions commented out

module.exports.getPostsByUserEmail = (email) => {
  return module.exports.getUserByEmail(email)
  .then((user) => {
    return models.posts.findAll({
      where: {
        poster_user_id: user.id
      }
    })
    .then((posts) => {
      for (let i = 0; i < posts.length; i++) {
        posts[i].latitude = parseFloat(posts[i].latitude);
        posts[i].longitude = parseFloat(posts[i].longitude);
        posts[i].poster_user_id = parseInt(posts[i].poster_user_id);
      }
      return replaceReferenceModelIdsWithModels(posts, 'poster_user_id', models.users, 'poster');
    });
  });
};

<<<<<<< HEAD
module.exports.getPostsByTrailId = (id) => {
  return models.posts.findAll({
    where: {trail_id: id}
=======
// module.exports.getPostsByTrailId = (id) => {
//   return helpers.getPosts({trail_id: id});
// };

module.exports.getPostsByTrailName = (name) => {
  return module.exports.getTrailByName(name)
  .then((trail) => {
    return helpers.getPosts({trail_id: trail.id});
>>>>>>> Has unuseful functions commented out
  })
  .then((posts) => {
    for (let i = 0; i < posts.length; i++) {
      posts[i].latitude = parseFloat(posts[i].latitude);
      posts[i].longitude = parseFloat(posts[i].longitude);
      posts[i].poster_user_id = parseInt(posts[i].poster_user_id);
    }
    return replaceReferenceModelIdsWithModels(posts, 'poster_user_id', models.users, 'poster');
  });
};

// Used when getting an array of models that contain foreign keys
// and, for each instance in the array, will replace the foreign
// key with the model it is pointing to
//
// modelArray - the array of existing models where each model contains a foreign ID
// idToReplace - a string representing the name of the foreign key that will be replaced
// modelToReplaceWith - the sequelize model that will be searched for using the foreign key
// modelKey - the key where the new foreign-referenced model will be replaced within each element of modelArray
let replaceReferenceModelIdsWithModels = (modelArray, idToReplace, modelToReplaceWith, modelKey) => {
  let getModelPromises = []; // An array of promises, one for each model in the model array
  modelArray.forEach((model) => {
    let referenceModelId = model[idToReplace];
    delete model[idToReplace];
    getModelPromises.push(
      modelToReplaceWith.findOne({
        where: {
          id: referenceModelId
        }
      })
      .then((referenceModel) => {
        model[modelKey] = referenceModel;
        return model;
      })
    );
  });
  return Promise.all(getModelPromises);
};
