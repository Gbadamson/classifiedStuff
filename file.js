const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const user = require("./model/user");
const User = require("./model/user");
const port = 5334;
const app = express();
const db_url = "mongodb://localhost:27017/wassceDemo";
mongoose.connect(db_url);
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err + "There is something wrong");
});
db.once("open", () => {
  console.log("Our Database is on");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("This  Application is running fine");
});

app.post("/", (req, res) => {
  const { phoneNumber, text, sessionId } = req.body;

  let response;

  if (text === "") {
    response = "CON Enter your first name";
  }
  if (text !== "") {
    //to split the user inputs from the front end
    let array = text.split("*");
    console.log(array);
    if (array.length === 1) {
      response = "CON Enter your id Number";
    } else if (array.length === 2) {
      if (parseInt(array[1]) > 0) {
        response =
          "CON Please confirm if you want to save the data\n1. Confrim\n2. Cancel \n3. View all users";
      } else {
        response = "END Bad Network request";
      }
    } else if (array.length === 3) {
      if (parseInt(array[2]) === 1) {
        let data = new User();
        data.fullname = array[0];
        data.id_number = array[1];
        data.save(() => {
          response = "END Your Data has been saved";
        });
      } else if (parseInt(array[2]) === 2) {
        response = "END Oops!, data was not saved";
      } else if (parseInt(array[2]) === 3) {
        User.find({}, (err, users) => {
          let user_data = `${
            users.length < 1
              ? `No data found`
              : `${users
                  .map((items, index) => {
                    return `${index + 1}. ${items.fullname}\n`;
                  })
                  .join("")}`
          }`;
          response = `END Current Users. \n${user_data}`;
        });
      } else {
        response = "END Invald input.";
      }
    } else {
      response = "END Network error. Please try again.";
    }
  }

  setTimeout(() => {
    console.log(text);
    res.send(response);
    res.end();
  }, 2000);
});

app.listen(port, () => {
  console.log("Our app is running on port " + port);
});
