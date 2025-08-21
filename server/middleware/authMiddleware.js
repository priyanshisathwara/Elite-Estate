import jwt from 'jsonwebtoken';

export const verifyUser = (req, res, next) => {
  
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
     
      console.error("Token expired:", err); 
      return res.status(401).json({ message: "Token expired. Please login again." });
    } else {
      console.error("Token verification failed:", err); 
      return res.status(403).json({ message: "Invalid token" });
    }
  }
};
