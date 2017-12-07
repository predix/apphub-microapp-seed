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
    var model = req.app.models.db.instance;
    var id = req.params.id;
    if(id && model.get('docs').find({id: id})){
      res.status(200).json(
        model.get('docs').find({id: id}).value()
      );
    } else {
      res.status(404).json({
        error: `${id} not found`
      });
    }
  }
  put(req, res, next){
    var model = req.app.models.db.instance;
    var id = req.params.id;
    if(req.params.id && model.get('docs').find({id: id}).value()){
      model.get('docs')
        .find({id: id})
        .assign( req.body )
        .write();

      res.status(200).json({
        ok: true,
        message: `updated ${id}`
      });
    } else {
      res.status(404).json({
        error: `${id} not found`
      });
    }
  }

  post(req, res, next){
    if(req.body){
      req.body.id = `doc-${Date.now()}`;
    }
    req.app.models.db.instance.get('docs').push( req.body ).write();
    res.status(201).json(req.body);
  }

  delete(req, res, next){
    var model = req.app.models.db.instance;
    var id = req.params.id;
    if(req.params.id && model.get('docs').find({id: id}).value()){
      model.get('docs').remove({id: id}).write();
      res.status(200).json({
        ok: true
      });
    } else {
      res.status(404).json({
        error: `${id} not found`
      });
    }
  }
}

module.exports = new ApiController();
