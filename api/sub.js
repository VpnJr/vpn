export default async function handler(req, res) {
  try {
    const url = "https://your-durev.com/sub/ZvsyXmESUjY1JXXtxY-XML";

    const response = await fetch(url);
    const encoded = await response.text();

    const decoded = Buffer.from(encoded, "base64").toString("utf-8");

    let configs = decoded.split("\n").filter(Boolean);

    const countryCount = {};

    configs = configs.map((cfg) => {
      let base = cfg;
      let name = "";

      if (cfg.includes("#")) {
        [base, name] = cfg.split("#");
      }

      let country = name.split(" ")[0] || "Unknown";

      if (!countryCount[country]) {
        countryCount[country] = 1;
      } else {
        countryCount[country]++;
      }

      const count = countryCount[country];

      const newName =
        count === 1
          ? `Jr VPN ${country}`
          : `Jr VPN ${country} ${count}`;

      return `${base}#${newName}`;
    });

    const finalText = configs.join("\n");
    const finalEncoded = Buffer.from(finalText).toString("base64");

    res.setHeader("Content-Type", "text/plain");
    res.send(finalEncoded);

  } catch (e) {
    res.status(500).send("error");
  }
}
