module.exports = {
  validation: (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.body);
      if (result.error) {
        return res.status(400).send(result.error.details[0].message);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value['body'] = result.value;
      next();
    };
  },
};
