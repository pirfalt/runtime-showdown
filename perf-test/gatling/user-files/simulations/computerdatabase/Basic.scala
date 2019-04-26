package computerdatabase

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class MySimulation extends Simulation {

  val host = System.getProperty("host") // "http://localhost:8080"

  val httpProtocol = http
    .baseUrl(host)
    .acceptHeader("application/json")
    .acceptEncodingHeader("gzip, deflate")
    .disableWarmUp
    .disableCaching

  val hello = exec(
    http("/api/hello/").get("/api/hello/")
  )
  val availability = exec(
    http("/api/availability/1.json").get("/api/availability/1.json")
  )
  val item = exec(
    http("/api/item/1.json").get("/api/item/1.json")
  )
  val itemset = exec(
    http("/api/itemset/1.json").get("/api/itemset/1.json")
  )

  val helloScn = scenario("hello").repeat(100) { exec(hello) }
  val availabilityScn = scenario("availability").repeat(100) { exec(availability) }
  val itemScn = scenario("item").repeat(100) { exec(item) }
  val itemsetScn = scenario("itemset").repeat(100) { exec(itemset) }

  setUp(
    helloScn.inject(rampUsers(100) during (180 seconds)),
    availabilityScn.inject(rampUsers(100) during (180 seconds)),
    itemScn.inject(rampUsers(100) during (180 seconds)),
    itemsetScn.inject(rampUsers(100) during (180 seconds))
  )
  .maxDuration(5 minutes)
  .protocols(httpProtocol)
}