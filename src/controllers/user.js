const UserModel = require("../models/schema/user");
const registerValidator = require("../models/validations/userRegister");

// update user profile
// TODO update email or not
const updateProfile = async function (req, res) {
  // validate the post form
  const validationVerdict = registerValidator(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res
      .status(400)
      .json({ message: validationVerdict.error.details[0].message });
  }
  let user;
  try {
    user = await UserModel.findByIdAndUpdate(req.userId, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ********************************************************************************************************* //

// change current subscription tier of the user.
const userChangeSubscription = async function (req, res) {
  if (!req.body.tier) {
    return res.json.status(404).json({ message: "missing subscription tier" });
  }
  let user;
  try {
    user = await UserModel.findByIdAndUpdate(
      req.userId,
      { tier: req.body.tier },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ data: user });
  } catch (err) {
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateProfile,
  userChangeSubscription,
};
