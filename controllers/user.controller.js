const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

// const salt = bcrypt.genSaltSync(10);

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบช่องว่าง
  if (!username || !password) {
    return res.status(400).send({ message: "กรุณากรอกให้ครบจ้า" });
  }

  try {
    // เช็คชื่อซ้ำ
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: "Username is already used" });
    }

    // เข้ารหัสรหัสผ่าน
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // บันทึกลง DB
    await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.send({
      message: "User Register Success",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "กรุณากรอกให้ครบจ้า" });
  }

  try {
    //เช็คว่ามี user ไหม
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    // 2) เปรียบเทียบรหัสผ่าน (เทียบกับ hash ใน DB)
    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "รหัสผ่านไม่ตรงค่า" });
    }

    jwt.sign({ username, id: user._id }, secret, {}, (err, token) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Internal Server Error: Authentication failed!!" });
      }
      res.send({
        message: "Logged in Successfully",
        //แก้ Backend ไม่ได้ส่งข้อมูลไป
        id: user._id,
        username: user.username,
        accessToken: token,
      });
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
