const express = require('express');

const modelFromReq = (req, Model) => Object.keys(Model.schema.obj).reduce(
  (accumulated, current) => (
    req.body[current]
      ? { ...accumulated, [current]: req.body[current] }
      : { ...accumulated }
  ),
  {},
);

module.exports = ({
  Model,
  middlewares = [],
  listAllRoute = true,
  listAllPath = '/',
  listMiddlewares = [],
  writeMiddlewares = [],
  createRoute = true,
  createPath = '/',
  bodyModelTransformation = model => model,
  createMiddlewares = [],
  deleteRoute = true,
  deleteModelId = 'id',
  deletePath = `/:${deleteModelId}`,
  deleteMiddlewares = [],
  updateRoute = true,
  updateModelId = 'id',
  updatePath = `/:${updateModelId}`,
  updateMiddlewares = [],
} = {}) => {
  const router = new express.Router();

  if (middlewares.length > 0) {
    router.use(...middlewares);
  }

  if (listAllRoute) {
    router.get(listAllPath, ...listMiddlewares, async (req, res) => {
      try {
        return res.send(await Model.find());
      } catch (err) {
        return res.errorHandler(err);
      }
    });
  }

  if (createRoute) {
    router.post(createPath, ...writeMiddlewares, ...createMiddlewares, async (req, res) => {
      try {
        return res.send(
          await Model.create(
            bodyModelTransformation(
              modelFromReq(req, Model)
            )
          )
        );
      } catch (err) {
        return res.errorHandler(err);
      }
    });
  }

  if (deleteRoute) {
    router.delete(deletePath, ...writeMiddlewares, ...deleteMiddlewares, async (req, res) => {
      try {
        const model = await Model.findOne({
          _id: req.params[deleteModelId],
        });

        if (model) {
          await model.remove();
        }

        return res.status(model ? 204 : 404).end();
      } catch (err) {
        return res.errorHandler(err);
      }
    });
  }

  if (updateRoute) {
    router.put(updatePath, ...writeMiddlewares, ...updateMiddlewares, async (req, res) => {
      try {
        const model = await Model.findOneAndUpdate(
          {
            _id: req.params[updateModelId],
          },
          bodyModelTransformation(
            modelFromReq(req, Model)
          ),
          {
            new: true,
          }
        );

        if (!model) {
          return res.status(404).end();
        }

        return res.send(model);
      } catch (err) {
        return res.errorHandler(err);
      }
    });
  }

  return router;
};
