const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please enter all the fields" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      pic,
    });

    const response = await newUser.save();

    if (!response) {
      return res.status(400).json({ error: "User not created" });
    }

    // Generate JWT token
    const token = generateToken(response._id);

    if (!token) {
      return res.status(400).json({ error: "Token not created" });
    }
 //   const final_response = await response.select("-password");

    // Send response with user data and token
    res.status(200).json({ response, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// for login authuser

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid Email or Password" });
    }

    const token = generateToken(user._id);

    res.json({ id: user._id, name:user.name, pic: user.pic, email: user.email, token: token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// allusers
// write using query
  
const allUsers = async(req,res)=>{
  console.log(req.query);

  const keyword = req.query.search ? {
    $or :[
      {name:{$regex:req.query.search , $options:"i"}},
      {email:{$regex:req.query.search , $options:"i"}}
    ],
  }
  :{};

  console.log(keyword);
  if(!keyword) res.send({message:"user not exist"});

  const users = await User.find(keyword).find({_id: { $ne: req.user._id}});
 // console.log(users);
res.send(users);
}





module.exports = { registerUser, authUser,allUsers };
 
  

    




