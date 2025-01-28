exports.getKeyString = (keys) => {
  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });
  let plural = "";
  if (keys.length > 1) plural = "s";
  return formatter.format(keys) + " key" + plural;
};
