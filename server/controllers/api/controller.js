const log = require('../../common/logger')('controllers/api');
/**
 * @description API Controller
 */
class ApiController {
  constructor(){
    log.debug('constructor');
  }
  all(req, res, next){
    res.status(200).json(req.app.models.example.find());
  }
  get(req, res, next){
    if(req.params.id){
      res.status(200).json(req.app.models.example.findByName(req.params.id));
    } else {
      res.status(404).json({
        error: 'Provide a id'
      });
    }
  }
  put(req, res, next){
    res.status(200).json({
      message: 'Updated',
      headers: req.headers,
      body: req.body
    });
  }
  post(req, res, next){
    res.status(201).json({
      message: 'Saved',
      headers: req.headers,
      body: req.body
    });
  }
  delete(req, res, next){
    res.status(200).json({
      message: 'Removed',
      headers: req.headers
    });
  }
}

module.exports = new ApiController();
