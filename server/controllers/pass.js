import bcrypt from "bcrypt";
bcrypt.hash('Prs123', 10).then(hash => console.log(hash));
