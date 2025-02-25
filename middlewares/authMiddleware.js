const admin = require("../config/firebase");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "No token provided" });
        }
  
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        req.user = decodedToken; // Attach user info to request
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
  };

const authenticateAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const token = authorization.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    console.log("Decoded Token:", decodedToken);

    if (!decodedToken.role) {
      return res.status(403).json({ error: "Role not found in token. Try logging out and logging back in." });
    }

    if (decodedToken.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

  
module.exports = {authenticateAdmin, verifyToken};

