const fs = require("fs");
const path = require("path");
const readline = require("readline");

const filePath = path.join(__dirname, "products.json");

// Simple "press Enter to continue" function
function waitForEnter(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, () => {
      rl.close();
      resolve();
    });
  });
}

async function main() {
  console.log("========================================");
  console.log(" Product discount updater");
  console.log("========================================");
  console.log();

  console.log(`Reading: ${filePath}`);
  console.log();

  if (!fs.existsSync(filePath)) {
    console.error("ERROR: products.json was not found.");
    await waitForEnter("\nPress ENTER to exit...");
    return;
  }

  // Read the JSON file
  const fileContents = fs.readFileSync(filePath, "utf8");

  // Convert JSON into JavaScript objects
  const data = JSON.parse(fileContents);

  console.log(`Found ${data.products.length} products.`);
  console.log();

  await waitForEnter("Press ENTER to start updating...");

  console.log();
  console.log("Updating discounts...");
  console.log("----------------------------------------");

  data.products.forEach((product, index) => {
    const oldDiscount = product.discountPercentage;

    // Missing discount field
    if (oldDiscount === undefined) {
      product.discountPercentage = 0;

      console.log(
        `Product ${product.id}: discount missing -> 0%`
      );

      return;
    }

    // Every other product: round to nearest 5
    if (index % 2 === 0) {
      const newDiscount = Math.round(oldDiscount / 5) * 5;

      product.discountPercentage = newDiscount;

      console.log(
        `Product ${product.id}: ${oldDiscount}% -> ${newDiscount}%`
      );
    }

    // The products in between: 0
    else {
      product.discountPercentage = 0;

      console.log(
        `Product ${product.id}: ${oldDiscount}% -> 0%`
      );
    }
  });

  console.log();
  await waitForEnter("Press ENTER to write the changes to products.json...");

  // Convert the JavaScript objects back into JSON
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log();
  console.log("========================================");
  console.log(" DONE");
  console.log("========================================");
  console.log();
  console.log(`Updated: ${filePath}`);
  console.log();

  await waitForEnter("Press ENTER to exit...");
}

main().catch(async (error) => {
  console.error();
  console.error("Something went wrong:");
  console.error(error);

  await waitForEnter("\nPress ENTER to exit...");
});