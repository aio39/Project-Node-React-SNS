function getIdParam(req) {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

function getPostIdAndUserId(req) {
  const id = req.params.id;
  const userId = req.user.id;
  return [id, userId];
}

module.exports = { getIdParam, getPostIdAndUserId };
