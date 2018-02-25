const express = require('express');

const modelFromReq = (req, Model) => Object.keys(Model.schema.obj).reduce(
  (accumulated, current) => (
    req.body[current]
      ? { ...accumulated, [current]: req.body[current]}
      : { ...accumulated }
  ),
  {},
);

module.exports = ({
  Model,
  listAllRoute = true,
  listAllPath = '/',
  createRoute = true,
  createPath = '/',
  bodyModelTransformation = model => model,
} = {}) => {
  const router = new express.Router();

  if (listAllRoute) {
    router.get(listAllPath, async (req, res) => {
      try {
        return res.send(await Model.find());
      } catch (err) {
        return res.errorHandler(err);
      }
    });
  }

  if (createRoute) {
    router.post(createPath, async (req, res) => {
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

  return router;
};
