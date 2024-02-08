const http = require("http");
const fs = require("fs");
const path = require("path");
const books = require("./books.json");

const app = http.createServer((req, res) => {
  if (req.url == "/books" && req.method == "GET") {
    const data = () =>
      fs.readFileSync("./books.json", (error) => {
        if (error) {
          return error;
        }
      });
    res.end(data());
  }

  for (var i = 0; i < books.length; i++) {
    if (req.method == "GET" && req.url == `/books/${i + 1}`) {
      const data = () =>
        fs.readFileSync("./books.json", (error) => {
          if (error) {
            return error;
          }
        });

      const parsedData = JSON.parse(data());
      res.end(JSON.stringify(parsedData[i], null, 4));
    }
  }

  if (req.url == "/add-books") {
    const addedElem = {
      id: books[books.length - 1].id + 1,
      title: "Adventures of Someone",
      author: "Someone Someone",
    };

    books.push(addedElem);

    fs.writeFile("./books.json", JSON.stringify(books, null, 4), () => {
      console.log("Successfully added");
    });

    res.end("Success");
  }

  for (var i = 0; i < books.length; i++) {
    if (req.method == "PUT" && req.url == `/put-books/${i + 1}`) {
      const { title, author } = req.body;

      books[i].title = title || books[i].title;
      books[i].author = author || books[i].author;
    }
  }

  for (var i = 0; i < books.length; i++) {
    if (req.url == `/delete-books/${i + 1}`) {
      const item = books.filter((item) => item.id != i + 1);
      fs.writeFile(
        path.join(__dirname, "books.json"),
        JSON.stringify(item, null, 4),
        (err) => {
          if (err) throw err;
        }
      );
      res.end("Success");
    }
  }
});

app.listen(4000);
