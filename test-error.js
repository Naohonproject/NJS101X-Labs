const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  throw new Error("invalid value");
};

try {
  console.log(sum(1));
} catch (error) {
  //   console.log(error);
  console.log("error occurs");
}
