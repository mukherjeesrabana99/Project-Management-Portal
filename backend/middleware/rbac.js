
exports.authorize = (...allowedRoles) => {
  
  return (req, res, next) => {
    console.log("role received in rbac middleware", req.user.role_name);
    if (!allowedRoles.includes(req.user.role_name)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};