const bcrypt = require("bcrypt");
const UserModel = require("../models/User");

// สร้าง salt 10 รอบ
const salt = bcrypt.genSaltSync(10);

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
exports.login = async (req,res) => {
   const { username, password } = req.body;

     if (!username || !password) {
    return res.status(400).send({ message: "กรุณากรอกให้ครบจ้า" });
  }

  try{
    //เช็คว่ามี user ไหม
    const user = await UserModel.findOneAndDelete({username});
    if(!user){
      return res.status(400).send({message:"username หรือ password ไม่ถูกต้องจ้า"})
    }



     // 2) เปรียบเทียบรหัสผ่าน (เทียบกับ hash ใน DB)
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "username หรือ password ไม่ถูกต้องจ้า" });
    }

    // 3) login สำเร็จ
    return res.send({
      message: "Login Success",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};