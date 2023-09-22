const jwt = require("jsonwebtoken");
const { app, users } = require(".");

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  console.log(user);
  if (user) {
    // res.json(user)
    const accesToken = jwt.sign(
      { id: user.id, isadmin: user.isadmin },
      "mySecretKey"
    );
    res.json({
      username: user.username,
      isadmin: user.isadmin,
      accesToken: accesToken,
    });
  } else {
    res.status(404).json("User name or Password incorrect");
  }
});
