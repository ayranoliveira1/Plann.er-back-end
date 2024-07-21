import request from "supertest";
import { app } from "../../../app";

describe("Trip", () => {
   it("should be able to create a new trip", async () => {
      await app.ready();
      const response = await request(app.server)
         .post("/trips")
         .send({
            destination: "New Trip",
            starts_at: "2024-08-01 18:00:00",
            ends_at: "2024-08-12 18:00:00",
            owner_name: "John Doe",
            owner_email: "nG9kV@example.com",
            emails_to_invite: ["nG9kV@example.com", "nG9kV@example.com"],
         });

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({ tripId: { id: expect.any(String) } });
   });
});
