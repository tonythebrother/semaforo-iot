const btn = document.querySelector("button");

btn.addEventListener("click", function () {
  // Make a request for a user with a given ID
  axios
    .post("http://localhost:3000/", 
    {
      topic:"prueba",
      message:"Hola Mundo"
    })
    .then(function (response) {
      // handle success
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
});
