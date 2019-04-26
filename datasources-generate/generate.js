const faker = require("faker");
const util = require("util");
const fs = require("fs");
const writeFile = util.promisify(fs.writeFile);

function idset(maxSize = 1000) {
  return {
    id: faker.random.uuid(),
    set: [...new Array(faker.random.number(maxSize))].map(faker.random.uuid)
  };
}

function item(id) {
  return {
    id,
    availability: faker.random.boolean(),
    price: faker.commerce.price(100, 5000, 2)
  };
}

function generate(idSetCount = 100) {
  // Generate sets
  var itemSets = [];
  for (let index = 0; index < idSetCount; index++) {
    var idSet = idset();
    itemSets.push(idSet);
  }

  // Extract ids in sets and generate items
  var allIds = Array.prototype.concat.apply([], itemSets.map(ids => ids.set));
  var allItems = allIds.map(item);

  return {
    itemSets,
    allItems
  };
}

async function main() {
  console.log();
  console.log("Generating data...");
  const data = generate();

  // Write /example/api/
  const idSet = data.itemSets[0];
  const item = data.allItems[0];
  const { id, availability, price } = item;
  await writeFile(
    `../example/api/itemset/${idSet.id}.json`,
    JSON.stringify(idSet, null, 2)
  );
  await writeFile(
    `../example/api/availability/${item.id}.json`,
    JSON.stringify({ id, availability }, null, 2)
  );
  await writeFile(
    `../example/api/price/${item.id}.json`,
    JSON.stringify({ id, price }, null, 2)
  );
  await writeFile(
    `../example/api/item/${item.id}.json`,
    JSON.stringify(item, null, 2)
  );

  // Write datasources
  console.log();
  console.log("Writing itemsets...");
  await writeFile(
    `../datasources/itemset/itemsets.json`,
    JSON.stringify({ itemSets: data.itemSets }, null, 2)
  );

  console.log();
  console.log("Writing availability...");
  for (const item of data.allItems) {
    process.stdout.write(".");
    let { id, availability } = item;
    await writeFile(
      `../datasources/availability/${item.id}.json`,
      JSON.stringify({ id, availability })
    );
  }

  console.log();
  console.log("Writing price...");
  const drop = `drop table if exists prices;`;
  const create = `create table prices (id uuid not null, price text not null, primary key (id));`;
  const inserts = data.allItems.map(
    ({ id, price }) => `insert into prices values ('${id}', '${price}');`
  );
  await writeFile(
    `../datasources/price/data.sql`,
    drop + "\n" + create + "\n" + inserts.join("\n")
  );
}

// rm -r {../datasources/itemset,../datasources/availability,../datasources/price}
// rm -r {../example/api/itemset,../example/api/availability,../example/api/price,../example/api/item}
// mkdir -p {../datasources/itemset,../datasources/availability,../datasources/price}
// mkdir -p {../example/api/itemset,../example/api/availability,../example/api/price,../example/api/item}

if (module === require.main) {
  main().catch(e =>
    setImmediate(() => {
      throw e;
    })
  );
}
